import { Context } from 'koa'
import * as jwt from 'koa-jwt'
import { config } from '../config'

export const jwtHandler = jwt({
  getToken(ctx: Context| any): any { // TODO: Typings are wrong
    const { authorization } = ctx.headers
    if (authorization && authorization.split(' ')[0] === 'Bearer') {
      return authorization.split(' ')[1]
    }
    return undefined
  },
  secret: config.jwtSecret,
  passthrough: true, // pushes handling logic to the consumer `auth-required` middleware
  key: 'jwt' // for access to: ctx.state.jwt
})

