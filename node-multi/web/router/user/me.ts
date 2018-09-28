import { Context } from 'koa'
import * as compose from 'koa-compose'
import * as User from '~models/user'
import { UserResponse } from '~web/interfaces'
import * as middleware from '~web/middleware'

async function me(ctx: Context): Promise<void> {
  const { jwt } = ctx.state
  const user = await User.read({ id: jwt.id })
  if (user) {
    const res: UserResponse = user
    ctx.body = res
  } else {
    ctx.throw(404)
  }

}

const composed = compose([
  middleware.authRequired,
  me
])

export { composed as me }

