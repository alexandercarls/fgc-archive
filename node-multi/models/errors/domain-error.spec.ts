// tslint:disable no-unused-expression

import { expect } from 'chai'
import { DomainError } from './domain-error'

describe('DomainError', () => {
  function doSomethingBad(): void {
    throw new DomainError('It went bad!', 42)
  }

  it('should set the name property to the error\'s name', () => {
    try {
      doSomethingBad()
    } catch (err) {
      expect(err.name).to.eql('DomainError')
    }
  })

  it('should be an instance of its class', () => {
    try {
      doSomethingBad()
    } catch (err) {
      expect(err).to.be.an.instanceof(DomainError)
    }
  })

  it('should be an instance of builtin `Error`', () => {
    try {
      doSomethingBad()
    } catch (err) {
      expect(err).to.be.an.instanceof(DomainError)
    }
  })

  it('should be recognized by Node.js\' util#isError', () => {
    try {
      doSomethingBad()
    } catch (err) {
      expect(require('util').isError(err)).to.be.true
    }
  })

  it('should have recorded a stack', () => {
    try {
      doSomethingBad()
    } catch (err) {
      expect(err.stack).to.not.be.empty
    }
  })

  it('should return the default error message formatting when calling toString', () => {
    try {
      doSomethingBad()
    } catch (err) {
      expect(err.toString()).to.be.eql('DomainError: It went bad!')
    }
  })

  it('should set the stack to start with the default error message formatting', () => {
    try {
      doSomethingBad()
    } catch (err) {
      expect(err.stack.split('\n')[0])
        .to.be.eql('DomainError: It went bad!')
    }
  })

  it('should set the first stack frame to be the function where the error was thrown.', () => {
    try {
      doSomethingBad()
    } catch (err) {
      expect(err.stack.split('\n')[1].indexOf('doSomethingBad'))
        .to.be.eql(7)
    }
  })

  it('should set the extra property', () => {
    try {
      doSomethingBad()
    } catch (err) {
      expect(err.extra).to.be.eql(42)
    }
  })
})
