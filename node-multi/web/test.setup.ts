// tslint:disable typedef

import * as chai from 'chai'
import chaiHttp = require('chai-http')
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'

chai.use(chaiHttp)
chai.use(sinonChai)

beforeEach(function () {
  this.sandbox = sinon.createSandbox()
})

afterEach(function () {
  this.sandbox.restore()
})
