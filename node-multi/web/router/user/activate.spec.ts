// tslint:disable no-unused-expression typedef

import { expect, request } from 'chai'
import * as User from '~models/user'
import { server } from '~web/server'

const PATH = '/api/users/activate'

describe(`POST ${PATH}`, () => {
  it('should return the activated user', async function () {
    const activationToken = '34fea06a4539da6e8be3879c4ff88b2b'
    // TODO: Fixture?
    const returnUser: Partial<User.User> = {
      id: '69715279-f562-469e-8baf-e9b51f21b3c2',
      email: 'john@hero.com',
      name: 'John Doe',
    }
    this.sandbox.stub(User, 'activate').resolves(returnUser)

    const res = await request(server.listen())
      .post(PATH)
      .send({ activationToken })
    expect(res.status).to.eql(200)
    expect(res.type).to.eql('application/json')
    expect(res.body).to.eql(returnUser)
    expect(User.activate).to.have.been.calledWith({ activationToken })
  })

  it('should return 404 when a user with the activation token is not in the db', async function () {
    const activationToken = 'asdf'
    this.sandbox.stub(User, 'activate').resolves(undefined)

    const res = await request(server.listen())
      .post(PATH)
      .send({ activationToken })
    expect(res.status).to.eql(404)
    expect(res.type).to.eql('application/json')
    expect(res.body).to.eql({ message: 'The requested resource does not exists' })
    expect(User.activate).to.have.been.calledWith({ activationToken })
  })
})
