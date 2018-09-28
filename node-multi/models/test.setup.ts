// tslint:disable typedef

require('dotenv').config({ path: '../.env' })
import * as chai from 'chai'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
import { db } from './db'

chai.use(sinonChai)

beforeEach(async function () {
  this.sandbox = sinon.createSandbox()
  await db.migrate.rollback()
  await db.migrate.latest()
  await db.seed.run()
})

afterEach(async function () {
  this.sandbox.restore()
  await db.migrate.rollback()
})
