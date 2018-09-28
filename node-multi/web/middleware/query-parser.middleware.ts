import { Context } from 'koa'
import * as qs from 'qs'

export function parseQueryFactory(options: qs.IParseOptions)
  : (ctx: Context, next: () => void) => Promise<void> {
  return async function parseQuery(ctx: Context, next: () => void): Promise<void> {
    ctx.query = qs.parse(ctx.querystring, options)
    ctx.request.query = ctx.query
    await next()
  }
}
