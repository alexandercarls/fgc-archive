// tslint:disable no-unused-expression typedef

import { expect, request } from 'chai'
import { AuthenticationError } from '~models/errors'
import * as User from '~models/user'
import { server } from '~web/server'

const PATH = '/api/users'

describe(`POST ${PATH}`, () => {
  it('should create and return a new user', async function () {
    // TODO: Fixture
    const createUser: Partial<User.User> = {
      name: 'John Doe',
      email: 'jd@test.com',
    }
    const returnUser = {
      id: '69715279-f562-469e-8baf-e9b51f21b3c2',
      name: createUser.name,
      email: createUser.email,
    }
    this.sandbox.stub(User, 'register').resolves(returnUser)

    const res = await request(server.listen())
      .post(PATH)
      .send(createUser)
    expect(res.status).to.eql(200)
    expect(res.type).to.eql('application/json')
    expect(res.body).to.have.eql(returnUser)
    expect(User.register).to.have.been.calledWith(createUser)
  })

  it('should return 400 for an existing email address', async function () {
    // TODO: Fixture
    const createUser: Partial<User.User> = {
      name: 'John Doe',
      email: 'jd@test.com',
    }
    this.sandbox.stub(User, 'register').rejects(new AuthenticationError('email already exists'))

    const res = await request(server.listen())
      .post(PATH)
      .send(createUser)
    expect(res.status).to.eql(400)
    expect(res.body).to.eql({ message: 'email already exists' })
    expect(res.type).to.eql('application/json')
    expect(User.register).to.have.been.calledWith(createUser)
  })
})
