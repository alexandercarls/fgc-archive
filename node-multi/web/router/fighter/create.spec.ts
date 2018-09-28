// tslint:disable no-unused-expression typedef

import { expect, request } from 'chai'
import { DomainError } from '~models/errors'
import * as Fighter from '~models/fighter'
import { FighterResponse } from '~web/interfaces'
import { server } from '~web/server'

const PATH = '/api/fighters'

describe(`POST ${PATH}`, () => {
  it('should create and return a new fighter', async function () {
    const createCharacter = {
      name: 'Sakura',
    }
    // TODO: Fixture
    const returnCharacter: FighterResponse = {
      id: '69715279-f562-469e-8baf-e9b51f21b3c2',
      displayName: createCharacter.name,
      fullName: createCharacter.name,
    }
    this.sandbox.stub(Fighter, 'create').resolves(returnCharacter)

    const res = await request(server.listen())
      .post(PATH)
      .send(createCharacter)
    expect(res.status).to.eql(200)
    expect(res.type).to.eql('application/json')
    expect(res.body).to.have.eql(returnCharacter)
    expect(Fighter.create).to.have.been.calledWith(createCharacter)
  })

  it('should return 400 for an existing character name', async function () {
    const createCharacter = {
      name: 'Blanka',
    }
    this.sandbox.stub(Fighter, 'create').rejects(new DomainError('name already exists'))

    const res = await request(server.listen())
      .post(PATH)
      .send(createCharacter)
    expect(res.status).to.eql(400)
    expect(res.body).to.eql({ message: 'name already exists' })
    expect(res.type).to.eql('application/json')
    expect(Fighter.create).to.have.been.calledWith(createCharacter)
  })
})
