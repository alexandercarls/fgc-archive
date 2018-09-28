import { Context } from 'koa'
import * as User from '~models/user'
import { UserResponse } from '~web/interfaces'

export async function list(ctx: Context): Promise<void> {
  const users = await User.list()
  const res: UserResponse[] = users
  ctx.body = res
}
