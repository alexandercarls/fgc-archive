// tslint:disable no-unused-expression typedef

import { expect } from 'chai'
import * as Mail from './mail'
import { transporter } from './transporter'

describe('Mail', () => {
  describe('.register', () => {
    it('should send the mail', async function () {
      this.sandbox.stub(transporter, 'sendMail').resolves()
      await Mail.register({ to: 'john.doe@test.com', activationToken: 'asdfgh' })

      expect(transporter.sendMail).to.have.been.called
    })

    it('should throw `ValidationError` for invalid `to` email', async function () {
      this.sandbox.stub(transporter, 'sendMail').rejects()
      try {
        // TODO: Test like these should no longer be necessary with a strongly typed language
        await Mail.register({ to: 'invalidmail' } as any)
      } catch (err) {
        expect(err.name).to.eql('ValidationError')
        expect(transporter.sendMail).to.not.have.been.called
        return
      }

      throw new Error('Did not validate')
    })
  })
})
