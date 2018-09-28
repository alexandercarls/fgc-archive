// tslint:disable no-unused-expression typedef

import { expect, request } from 'chai'
import * as User from '~models/user'
import { server } from '~web/server'

const PATH = '/api/users'

describe(`GET ${PATH}`, () => {
  it('should return all users', async function () {
    this.sandbox.stub(User, 'list').resolves([])

    const res = await request(server.listen()).get(PATH)
    expect(res.status).to.eql(200)
    expect(res.type).to.eql('application/json')
    expect(res.body).is.lengthOf(0)
    expect(User.list).to.have.been.calledWith()
  })
})
