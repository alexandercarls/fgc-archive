import { Context } from 'koa'
import * as User from '~models/user'
import { UserResponse } from '~web/interfaces'

export async function activate(ctx: Context): Promise<void> {
  const user = await User.activate(ctx.request.body as any)
  if (user) {
    const res: UserResponse = user
    ctx.body = res
  } else {
    ctx.throw(404)
  }
}
