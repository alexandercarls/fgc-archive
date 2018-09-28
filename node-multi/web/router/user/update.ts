import { Context } from 'koa'
import * as compose from 'koa-compose'
import * as User from '~models/user'
import { UserResponse } from '~web/interfaces'
import * as middleware from '~web/middleware'

async function update(ctx: Context): Promise<void> {
  const { userId } = ctx.params

  // Allow only updating yourself
  if (userId !== ctx.state.jwt.id) {
    ctx.throw(401)
  }

  const user = await User.update({ id: userId, ...ctx.request.body })
  if (user) {
    const res: UserResponse = user
    ctx.body = res
  } else {
    ctx.throw(404)
  }
}

const composed = compose([
  middleware.authRequired,
  update
])

export { composed as update }
