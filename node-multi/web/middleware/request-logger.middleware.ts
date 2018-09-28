import { Context } from 'koa'
import * as _ from 'lodash'
import { logger } from '~models/logger'

export function createRequestLogger(options: { level?: string } = {})
  : (ctx: Context, next: () => void) => Promise<void> {
  let { level = 'silly' } = options

  return async function requestLogger(ctx: Context, next: () => void): Promise<void> {
    const start = Date.now()

    const {
      method, originalUrl, headers: requestHeaders, body: requestBody
    } = ctx.request
    try {
      await next()
    } catch (err) {
      logger.error(`${method}: ${originalUrl}`, { error: err.message })
      throw err
    }

    if (ctx.status >= 500) {
      level = 'error'
    } else if (ctx.status >= 400) {
      level = 'warn'
    }

    const ms = new Date().getTime() - start

    const { status, headers: responseHeaders, body: responseBody = '' } = ctx.response
    const logContext = {
      method,
      originalUrl,
      duration: `${ms}ms`,
      request: _.omitBy({
        headers: _.omit(requestHeaders, ['authorization', 'cookie']),
        body: requestBody
      }, _.isNil),
      response: _.omitBy({
        status,
        headers: _.omit(responseHeaders, ['authorization', 'cookie']),
        body: responseBody
      }, _.isNil)
    }

    logger.log(level, `${method}: ${originalUrl}`, logContext)
  }
}
