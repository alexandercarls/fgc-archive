// tslint:disable no-unused-expression typedef

import { expect, request } from 'chai'
import * as User from '~models/user'
import { server } from '~web/server'

const PATH = '/api/users'

describe(`GET ${PATH}/:id`, () => {
  it('should return a single user', async function () {
    const id = '69715279-f562-469e-8baf-e9b51f21b3c2'
    // TODO: Remove Partial, Add Fixtures, maybe remove PG Logic for UUID and Timestampz
    const returnUser: Partial<User.User> = {
      id,
      name: 'John Doe',
      email: 'jd@test.com',
    }
    this.sandbox.stub(User, 'read').resolves(returnUser)

    const res = await request(server.listen())
      .get(`${PATH}/${id}`)
    expect(res.status).to.eql(200)
    expect(res.type).to.eql('application/json')
    expect(res.body).to.eql(returnUser)
    expect(User.read).to.have.been.calledWith({ id: returnUser.id })
  })

  it('should return 404 when a user is not in the db', async function () {
    const id = '69713279-f562-469e-8baf-e9b51f21b3c2' // unknown
    this.sandbox.stub(User, 'read').resolves(undefined)

    const res = await request(server.listen())
      .get(`${PATH}/${id}`)
    expect(res.status).to.eql(404)
    expect(res.type).to.eql('application/json')
    expect(res.body).to.eql({ message: 'The requested resource does not exists' })
    expect(User.read).to.have.been.calledWith({ id })
  })
})
