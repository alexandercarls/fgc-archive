// tslint:disable no-unused-expression typedef
//
// import { expect } from 'chai'
// import * as queue from '~models/queue'
// import { Channel } from '~models/queue'
// import * as worker from '~worker/worker'
// import * as handlers from '.'

// TODO: Worker test
// describe('Worker "register" channel', () => {
//   it(`should handle messages on the ${Channel.register} channel`, async function () {
//     const date = new Date().toISOString()
//     const email = 'newhero@gmail.com'
//
//     this.sandbox.stub(handlers, 'register').callsFake(async (params: any) => {
//       await worker.halt()
//       expect(params).to.be.eql({ date, email })
//     })
//
//     await worker.init()
//     await queue.publishObject(Channel.register, {
//       date,
//       email
//     })
//     expect(handlers.register).to.have.been.called
//   })
// })
