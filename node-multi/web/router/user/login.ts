import {Context} from 'koa'
import * as compose from 'koa-compose'
import {AuthenticationError} from '~models/errors'
import * as User from '~models/user'
import {config} from '~web/config'
import {LoginResponse} from '~web/interfaces'
import {signJWT} from '~web/lib/sign-jwt'

type Next = () => void

async function authenticate(ctx: Context, next: Next): Promise<void> {
  try {
    ctx.state.user = await User.authenticate(ctx.request.body as any)
  } catch (err) {
    if (err instanceof AuthenticationError) {
      ctx.throw(401, 'Email and/or password is wrong')
    }
    throw err
  }
  await next()
}

async function generateJWT(ctx: Context, next: Next): Promise<void> {
  if (!ctx.state.user) {
    ctx.throw(500, 'Expected a user to be in ctx.state')
  }
  ctx.state.token = signJWT(ctx.state.user.id, config.jwtDuration, config.jwtSecret)
  await next()
}

function respondJWT(ctx: Context): void {
  if (!ctx.state.user) {
    ctx.throw(500, 'Expected a user to be in ctx.state')
  }

  const res: LoginResponse = {
    jwt: ctx.state.token,
    user: ctx.state.user,
  }

  ctx.body = res
}

const composed = compose([
  authenticate,
  generateJWT,
  respondJWT
])

export {composed as login}

