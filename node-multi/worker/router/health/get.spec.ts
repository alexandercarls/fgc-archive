// tslint:disable no-unused-expression typedef

import { expect, request } from 'chai'
import * as db from '~models/db'
import * as queue from '~models/queue'
import { server } from '~worker/server'

const PATH = '/health'

describe(`GET ${PATH}`, () => {
  it('should be healthy', async function () {
    this.sandbox.stub(db, 'healthCheck').resolves()
    this.sandbox.stub(queue, 'healthCheck').resolves()

    const res = await request(server.listen())
      .get(PATH)

    expect(res.status).to.eql(200)
    expect(res.body).to.be.eql({
      status: 'ok'
    })

    expect(db.healthCheck).to.have.been.called
    expect(queue.healthCheck).to.have.been.called
  })

  it('should return 500 if the db is not healthy', async function () {
    this.sandbox.stub(db, 'healthCheck').rejects(new Error())
    this.sandbox.stub(queue, 'healthCheck').resolves()

    const res = await request(server.listen())
      .get(PATH)

    expect(res.status).to.eql(500)
    expect(db.healthCheck).to.have.been.called
  })

  it('should return 500 if the queue is not healthy', async function () {
    this.sandbox.stub(db, 'healthCheck').resolves()
    this.sandbox.stub(queue, 'healthCheck').rejects(new Error())

    const res = await request(server.listen())
      .get(PATH)

    expect(res.status).to.eql(500)
    expect(queue.healthCheck).to.have.been.called
  })

  it('should return 503 if the process got SIGTERM', async function () {
    this.sandbox.stub(db, 'healthCheck').resolves()
    this.sandbox.stub(queue, 'healthCheck').resolves()

    process.emit('SIGTERM')

    const res = await request(server.listen())
      .get(PATH)

    expect(res.status).to.eql(503)
    expect(db.healthCheck).not.to.have.been.called
    expect(queue.healthCheck).not.to.have.been.called
  })
})
