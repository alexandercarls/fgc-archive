// tslint:disable no-unused-expression typedef

import { expect, request } from 'chai'
import * as User from '~models/user'
import { config } from '~web/config'
import { signJWT } from '~web/lib/sign-jwt'
import { server } from '~web/server'

const PATH = '/api/users'

describe(`PUT ${PATH}/:id`, () => {
  it('should update user', async function () {
    const id = '69715279-f562-469e-8baf-e9b51f21b3c2'
    // TODO: Fixture
    const updatedUser: Partial<User.User> = {
      id,
      name: 'Jane Doe',
    }
    this.sandbox.stub(User, 'update').resolves(updatedUser)

    const jwt = signJWT(id, config.jwtDuration, config.jwtSecret)

    const res = await request(server.listen())
      .put(`${PATH}/${id}`)
      .set('Authorization', `Bearer ${jwt}`)
      .send({ name: 'Jane Doe' })
    expect(res.status).to.eql(200)
    expect(res.type).to.eql('application/json')
    expect(res.body).to.eql(updatedUser)
    expect(User.update).to.have.been.calledWith({ id: updatedUser.id, name: 'Jane Doe' })
  })

  it('should throw 404 when user does not exist', async function () {
    const id = '69715279-f562-469e-8baf-e9b51f41b3cf' // unknown
    // TODO: Fixture
    const updatedUser: Partial<User.User> = {
      id,
      name: 'Jane Doe',
    }
    this.sandbox.stub(User, 'update').resolves(undefined)

    const jwt = signJWT(id, config.jwtDuration, config.jwtSecret)

    const res = await request(server.listen())
      .put(`${PATH}/${id}`)
      .set('Authorization', `Bearer ${jwt}`)
      .send({ name: 'Jane Doe' })
    expect(res.status).to.eql(404)
    expect(res.type).to.eql('application/json')
    expect(res.body).to.have.key('message')
    expect(User.update).to.have.been.calledWith({ id: updatedUser.id, name: 'Jane Doe' })
  })

  it('should return 401 when auth is missing', async function () {
    const id = '69715279-f562-469e-8baf-e9b51f21b3c2'

    this.sandbox.stub(User, 'update').rejects()
    const res = await request(server.listen())
      .put(`${PATH}/${id}`)
      .send({ name: 'Jane Doe' })

    expect(res.status).to.eql(401)
    expect(res.body).to.have.key('message')
    expect(User.update).to.not.have.been.called
  })

  it('should return 401 when resource does not belong to the authenticated user', async function () {
    const id = '69715279-f562-469e-8baf-e9b51f21b3c2'

    this.sandbox.stub(User, 'update').rejects()
    const jwt = signJWT('99999999-f562-469e-8baf-e9b51f21b399', config.jwtDuration, config.jwtSecret)
    const res = await request(server.listen())
      .put(`${PATH}/${id}`)
      .set('Authorization', `Bearer ${jwt}`)
      .send({ name: 'Jane Doe' })

    expect(res.status).to.eql(401)
    expect(res.body).to.have.key('message')
    expect(User.update).not.to.have.been.called
  })
  it('should return 400 when update throws an `ValidationError`', async function () {
    const id = '69715279-f562-469e-8baf-e9b51f21b3c2'

    const error = new Error('joi ValidationError')
    error.name = 'ValidationError'

    this.sandbox.stub(User, 'update').rejects(error)

    const jwt = signJWT(id, config.jwtDuration, config.jwtSecret)

    const res = await request(server.listen())
      .put(`${PATH}/${id}`)
      .set('Authorization', `Bearer ${jwt}`)
      .send({ name: 'John Doe', isAdmin: true })
    expect(res.status).to.eql(400)
    expect(res.type).to.eql('application/json')
  })

})
