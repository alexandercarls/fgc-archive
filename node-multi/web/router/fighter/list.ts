import { Context } from 'koa'
import * as Fighter from '~models/fighter'
import { FighterResponse } from '~web/interfaces'

export async function list(ctx: Context): Promise<void> {
  const fighters = await Fighter.list()
  const res: FighterResponse[] = fighters
  ctx.body = res
}
