// tslint:disable no-unused-expression typedef

import { expect, request } from 'chai'
import * as User from '~models/user'
import { config } from '~web/config'
import { signJWT } from '~web/lib/sign-jwt'
import { server } from '~web/server'

const PATH = '/api/users'

describe(`GET ${PATH}/me`, () => {
  it('should return user from token', async function () {
    const userId = '69715279-f562-469e-8baf-e9b51f21b3c2'
    // TODO: Fixture
    const returnUser: Partial<User.User> = {
      id: userId,
      name: 'John Doe',
      email: 'jd@test.com',
    }
    this.sandbox.stub(User, 'read').resolves(returnUser)

    const jwt = signJWT(userId, config.jwtDuration, config.jwtSecret)
    const res = await request(server.listen())
      .get(`${PATH}/me`)
      .set('Authorization', `Bearer ${jwt}`)

    expect(res.status).to.eql(200)
    expect(res.type).to.eql('application/json')
    expect(res.body).to.eql(returnUser)
    expect(User.read).to.have.been.calledWith({ id: userId })
  })
})
