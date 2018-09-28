import { Context } from 'koa'
import * as Fighter from '~models/fighter'
import { FighterResponse } from '~web/interfaces'

export async function get(ctx: Context): Promise<void> {
  const fighter = await Fighter.read({ id: ctx.params.fighterId })
  if (fighter) {
    const res: FighterResponse = fighter
    ctx.body = res
  } else {
    ctx.throw(404)
  }
}
