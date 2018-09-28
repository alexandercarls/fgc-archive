import { Context } from 'koa'

export async function authRequired(ctx: Context, next: () => void): Promise<void> {
  if (!ctx.state.jwt) {
    ctx.throw(401)
  }
  await next()
}
