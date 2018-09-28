import {Context} from 'koa'
import {DomainError} from '~models/errors'
import * as Fighter from '~models/fighter'
import {FighterResponse} from '~web/interfaces'

export async function create(ctx: Context): Promise<void> {
  try {
    const res: FighterResponse = await Fighter.create(ctx.request.body as any)
    ctx.body = res
  } catch (err) {
    if (err instanceof DomainError) {
      ctx.throw(400, err.message)
    }
    throw err
  }
}
