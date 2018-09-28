// tslint:disable no-unused-expression typedef
import { expect, request } from 'chai'
import * as Fighter from '~models/fighter'
import { server } from '~web/server'

const PATH = '/api/fighters'

describe(`GET ${PATH}`, () => {
  it('should return all fighters', async function () {
    this.sandbox.stub(Fighter, 'list').resolves([])

    const res = await request(server.listen()).get(PATH)
    expect(res.status).to.eql(200)
    expect(res.type).to.eql('application/json')
    expect(res.body).is.lengthOf(0)
    expect(Fighter.list).to.have.been.calledWith()
  })
})
