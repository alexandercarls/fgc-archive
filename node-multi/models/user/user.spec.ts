// tslint:disable no-unused-expression typedef

import { expect } from 'chai'
import { activatedUser, deactivatedUser } from 'tests/fixtures/users'
import { db } from '../db'
import { AuthenticationError } from '../errors'
import * as queue from '../queue'
import * as User from './user'

describe('User', () => {
  describe('.register', () => {
    it('should register a new user and return it', async function () {
      this.sandbox.stub(queue, 'publishObject').resolves()

      const userToCreate = {
        name: 'John Doe',
        email: 'jd@test.com',
        password: 'hakunamatata',
      }
      const userReturned = await User.register(userToCreate)
      const userInDB = await db(User.tableName)
        .where({ id: userReturned.id })
        .first()

      expect(userInDB).to.include.keys(Object.keys(userToCreate))
      expect(userInDB.password).to.not.eql(userToCreate.password)
      expect(userReturned).to.have.keys(['id', 'name', 'email', 'createdAt'])
      expect(queue.publishObject).to.have.been.called
    })

    it('should throw `AuthenticationError` when the email already exists in the db', async function () {
      this.sandbox.stub(queue, 'publishObject').resolves()
      try {
        const { email, password, name } = activatedUser
        await User.register({ email, name, password })
      } catch (err) {
        expect(err.message).to.eql(`User with ${activatedUser.email} already exists`)
        expect(err).to.be.an.instanceof(AuthenticationError)
        expect(queue.publishObject).to.not.have.been.called
        return
      }

      throw new Error('Did not validate')
    })

    it('should lowercase the email', async function () {
      this.sandbox.stub(queue, 'publishObject').resolves()
      const userToCreate = {
        name: 'John Doe',
        email: 'JD@TEST.COM',
        password: 'hakunamatata',
      }
      const { id } = await User.register(userToCreate)
      const userInDB = await db(User.tableName)
        .where({ id })
        .first()

      expect(userInDB.email).to.eql(userToCreate.email.toLowerCase())
      expect(queue.publishObject).to.have.been.called
    })
  })

  describe('.read', () => {
    it('should return a user', async () => {
      const result = await User.read({ id: activatedUser.id })

      expect(result).to.includes({
        id: activatedUser.id,
        name: activatedUser.name,
        email: activatedUser.email
      })
    })

    it('should throw `ValidationError` for invalid id', async () => {
      try {
        await User.read({ id: 'invalid_id' })
      } catch (err) {
        expect(err.name).to.eql('ValidationError')
        return
      }

      throw new Error('Did not validate')
    })

    it('should throw `ValidationError` if an unkown property is provided', async () => {
      try {
        await User.read({
          id: '69715279-f562-469e-8baf-e9b51f21b3c2',
          unknown: 'unknown property'
        } as any)
      } catch (err) {
        expect(err.name).to.eql('ValidationError')
        return
      }

      throw new Error('Did not validate')
    })

    it('should return undefined if the user is not in the db', async () => {
      const result = await User.read({ id: '69715279-f562-469e-8baf-e9b51f21b3c3' })

      expect(result).to.be.undefined
    })
  })

  describe('.update', () => {
    it('should update a user and return it', async () => {
      const userToUpdate = {
        id: '69715279-f562-469e-8baf-e9b51f21b3c2',
        email: 'newmail@gmail.com',
      }
      const returnedUser = await User.update(userToUpdate)
      expect(returnedUser).to.include(userToUpdate)
    })

    it('should throw `ValidationError` if an unknown property is provided', async () => {
      try {
        await User.update({ id: '040e3599-4d35-4fae-8839-fda1c25344ee', isAdmin: 'not@db.com' } as any)
      } catch (err) {
        expect(err.name).to.eql('ValidationError')
        expect(err.details[0].message).to.eql('"isAdmin" is not allowed')
        return
      }

      throw new Error('Did not validate')
    })
  })

  describe('.list', () => {
    it('should return a an array of users', async () => {
      const result = await User.list()
      expect(result).to.be.lengthOf(2)
    })
  })

  // TODO: Change activationToken expiration or just remove it for now
  // Prevents locking accounts, however I prefer resending account verification, when you sign up but are known.
  describe('.activate', () => {
    it('should activate the user and return it', async () => {
      const activationToken = deactivatedUser.activationToken
      const user = await User.activate({ activationToken })
      const userInDB = await db(User.tableName)
        .where({ activationToken })
        .first()

      expect(userInDB.active).to.be.true
      expect(user).to.include({
        id: deactivatedUser.id,
        email: deactivatedUser.email,
        name: deactivatedUser.name,
      })
    })

    it('should throw `ValidationError` if no `activationToken` is provided', async () => {
      try {
        await User.activate({ unknown: 'unkown' } as any)
      } catch (err) {
        expect(err.name).to.eql('ValidationError')
        return
      }

      throw new Error('Did not validate')
    })

    it('should return undefined for an unknown `activationToken`', async () => {
      const activationToken = '94fea06a4534da6e8be3879c4ff88b2b' // unkown
      const user = await User.activate({ activationToken })

      expect(user).to.be.undefined
    })
  })

  describe('.authenticate', () => {
    it('should throw `AuthenticationError` for a non-existing user', async () => {
      try {
        await User.authenticate({ email: 'unknownemail@test.com', password: '12345' })
      } catch (err) {
        expect(err).to.be.an.instanceof(AuthenticationError)
        expect(err.message).to.eql('User with email unknownemail@test.com does not exist')
        return
      }

      throw new Error('Did not validate')
    })

    it('should throw `AuthenticationError` for an non-matching password', async () => {
      try {
        await User.authenticate({ email: 'john@hero.com', password: 'wrongpassword' })
      } catch (err) {
        expect(err).to.be.an.instanceof(AuthenticationError)
        expect(err.message).to.eql('User with email john@hero.com and password wrongpassword does not match')
        return
      }

      throw new Error('Did not validate')
    })

    it('should throw `AuthenticationError` for an non-active user', async () => {
      try {
        await User.authenticate({ email: 'jane@hero.com', password: 'hakunamatata' })
      } catch (err) {
        expect(err).to.be.an.instanceof(AuthenticationError)
        expect(err.message).to.eql('User with email jane@hero.com is not activated')
        return
      }

      throw new Error('Did not validate')
    })

    it('should return the user after a successfull authentication', async () => {
      const result = await User.authenticate({ email: activatedUser.email, password: 'hakunamatata' })
      expect(result).to.include({
        id: activatedUser.id,
        name: activatedUser.name,
        email: activatedUser.email
      })
    })
  })
})
