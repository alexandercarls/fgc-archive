// tslint:disable no-unused-expression

import { expect } from 'chai'
import { healthCheck } from './health-check'

describe('Queue', () => {
  describe('healthCheck', () => {
    it('should return true', async () => {
      const res = await healthCheck()
      expect(res).to.be.true
    })
  })
})
