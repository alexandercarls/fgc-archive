import { Context } from 'koa'
import * as fp from 'lodash/fp'
import { logger } from '~models/logger'

export async function errorHandler(ctx: Context, next: () => void): Promise<void> {
  try {
    await next()
  } catch (err) {
    logger.verbose(err.name, err.status, err.message, err)

    ctx.type = 'application/json'
    ctx.status = err.status || 500

    if (err.name === 'UnauthorizedError') {
      ctx.body = { message: 'Unauthorized' }
    } else if (err.name === 'NotFoundError') {
      ctx.body = { message: 'The requested resource does not exists' }
    } else if (err.name === 'BadRequestError') {
      ctx.body = { message: err.message}
    } else if (err.name === 'ValidationError') {
      const errors = fp.compose([
        fp.mapValues(fp.map('message')),
        fp.groupBy('context.key')
      ])(err.details)
      ctx.body = { errors }
      ctx.status = 400
    }

    ctx.app.emit('error', err, ctx)
  }
}
