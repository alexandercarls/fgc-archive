import { Context } from 'koa'
import * as Fighter from '~models/fighter'
import { MoveResponse } from '~web/interfaces'

export async function listMoves(ctx: Context): Promise<void> {
  const fighters = await Fighter.listMoves({ fighterId: ctx.params.fighterId })
  const res: MoveResponse[] = fighters
  ctx.body = res
}
