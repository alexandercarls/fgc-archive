// tslint:disable no-unused-expression typedef

import { expect, request } from 'chai'
import * as Fighter from '~models/fighter'
import { server } from '~web/server'

const PATH = '/api/fighters'

describe(`GET ${PATH}/:fighterId`, () => {
  it('should return a single fighter', async function () {
    const id = '69715279-f562-469e-8baf-e9b51f21b3c2'
    const returnChar: Fighter.Fighter = {
      id,
      displayName: 'Paul',
      fullName: 'Paul Phoenix',
    }
    this.sandbox.stub(Fighter, 'read').resolves(returnChar)

    const res = await request(server.listen())
      .get(`${PATH}/${id}`)
    expect(res.status).to.eql(200)
    expect(res.type).to.eql('application/json')
    expect(res.body).to.eql(returnChar)
    expect(Fighter.read).to.have.been.calledWith({ id })
  })

  it('should return 404 when a fighter is not in the db', async function () {
    const id = '69713279-f562-469e-8baf-e9b51f21b3c2' // unkown
    this.sandbox.stub(Fighter, 'read').resolves(undefined)

    const res = await request(server.listen())
      .get(`${PATH}/${id}`)
    expect(res.status).to.eql(404)
    expect(res.type).to.eql('application/json')
    expect(res.body).to.eql({ message: 'The requested resource does not exists' })
    expect(Fighter.read).to.have.been.calledWith({ id })
  })
})
