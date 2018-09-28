// tslint:disable no-unused-expression typedef

import { expect, request } from 'chai'
import { AuthenticationError } from '~models/errors'
import * as User from '~models/user'
import { server } from '~web/server'

const PATH = '/api/users'

describe(`POST ${PATH}/login`, () => {
  it('should return a JWT', async function () {
    // TODO: Fixture
    const returnUser: Partial<User.User> = {
      id: '69715279-f562-469e-8baf-e9b51f21b3c2',
      name: 'John Doe',
      email: 'john@hero.com',
    }
    const auth = {
      email: 'john@hero.com',
      password: '$2a$10$dlTyrJxJ4bG8vPzfNY1Zf.mFnU5Oqa9HpL81ASnHnDZAOfhHoxFv2',
    }
    this.sandbox.stub(User, 'authenticate').resolves(returnUser)
    const res = await request(server.listen())
      .post(`${PATH}/login`)
      .send(auth)
    expect(res.status).to.eql(200)
    expect(res.type).to.eql('application/json')
    expect(Object.keys(res.body)).to.eql(['jwt', 'user'])
    expect(res.body.user).to.eql(returnUser)
    expect(User.authenticate).to.have.been.calledWith({ email: auth.email, password: auth.password })
  })

  it('should return 401 when `authenticate` rejects', async function () {
    const auth = {
      email: 'someemail@test.com',
      password: 'somepassword',
    }
    this.sandbox.stub(User, 'authenticate').rejects(new AuthenticationError(''))
    const res = await request(server.listen())
      .post(`${PATH}/login`)
      .send(auth)
    expect(res.status).to.eql(401)
    expect(res.type).to.eql('application/json')
    expect(res.body).to.eql({ message: 'Unauthorized' })
    expect(User.authenticate).to.have.been.calledWith({ email: auth.email, password: auth.password })
  })
})
