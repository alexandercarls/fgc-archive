import {Context} from 'koa'
import {AuthenticationError} from '~models/errors'
import * as User from '~models/user'
import {UserResponse} from '~web/interfaces'

export async function register(ctx: Context): Promise<void> {
  try {
    const res: UserResponse = await User.register(ctx.request.body as any)
    ctx.body = res
  } catch (err) {
    if (err instanceof AuthenticationError) {
      ctx.throw(400, err.message)
    }
    throw err
  }
}
