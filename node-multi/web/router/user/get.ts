import { Context } from 'koa'
import * as User from '~models/user'
import { UserResponse } from '~web/interfaces'

export async function get(ctx: Context): Promise<void> {
  const user = await User.read({ id: ctx.params.userId })
  if (user) {
    const res: UserResponse = user
    ctx.body = res
  } else {
    ctx.throw(404)
  }
}
