import { Context } from 'koa'
import * as db from '~models/db'
import { logger } from '~models/logger'
import * as queue from '~models/queue'

// Lifetime of process
const state = {
  shutdown: false
}

process.on('SIGTERM', () => {
  state.shutdown = true
})

export async function get(ctx: Context): Promise<void> {
  if (state.shutdown) {
    ctx.throw(503, 'Service is shutting down')
  }

  try {
    await db.healthCheck()
  } catch (err) {
    const message = 'Database health check failed'
    logger.error(message, err)
    ctx.throw(500, message)
  }

  try {
    await queue.healthCheck()
  } catch (err) {
    const message = 'Queue health check failed'
    logger.error(message, err)
    ctx.throw(500, message)
  }

  ctx.body = {
    status: 'ok'
  }
}
