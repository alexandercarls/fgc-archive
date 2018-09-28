import { expect, request } from 'chai'
import { server } from './server'

const PATH = '/unknownroute'

describe(`GET ${PATH}`, () => {
  it('should respond with `404` for an unknown route', async () => {
    const res = await request(server.listen())
      .get(PATH)
    expect(res.status).to.equal(404)
    expect(res.type).to.equal('application/json')
    expect(res.body.message).to.equal('The requested resource does not exists')
  })
})
