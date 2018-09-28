import { expect } from 'chai'
import { db } from '../db'
import * as Fighter from './fighter'

describe('Fighter', () => {
  describe('.create', () => {
    it('should create a new fighter and return it', async () => {
      const charToCreate = {
        rbnorwayId: 'lucky-chloe',
        displayName: 'Lucky Chloe',
        fullName: 'Lucky Chloe'
      }
      const charReturned = await Fighter.create(charToCreate)
      const charInDB = await db(Fighter.tableName)
        .where({ id: charReturned.id })
        .first()

      expect(charInDB.displayName).to.eql(charToCreate.displayName)
      expect(charReturned).to.have.keys(['id', 'displayName', 'fullName'])
    })
  })

  describe('.read', () => {
    it('should return a fighter', async () => {
      const id = '69715279-f562-469e-8baf-e9b51f21b3c2'
      const result = await Fighter.read({ id })

      expect(result).to.include({
        id,
        displayName: 'Raven',
      })
    })

    it('should throw `ValidationError` for invalid id', async () => {
      try {
        await Fighter.read({ id: 'invalid_id' })
      } catch (err) {
        expect(err.name).to.eql('ValidationError')
        return
      }

      throw new Error('Did not validate')
    })

    it('should throw `ValidationError` if an unkown property is provided', async () => {
      try {
        await Fighter.read({
          id: '69715279-f562-469e-8baf-e9b51f21b3c2',
          unknown: '040e3599-4d35-4fae-8839-fda1c25344ee'
        } as any)
      } catch (err) {
        expect(err.name).to.eql('ValidationError')
        return
      }

      throw new Error('Did not validate')
    })

    it('should return undefined if the fighter is not in the db', async () => {
      const result = await Fighter.read({ id: '69715279-f562-469e-8baf-e9b51f21b3c3' })

      expect(result).to.eql(undefined)
    })
  })

  describe('.list', () => {
    it('should return a an array of users', async () => {
      const result = await Fighter.list()
      expect(result).to.be.lengthOf(2)
    })
  })
})
