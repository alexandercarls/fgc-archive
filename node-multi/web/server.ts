import * as Koa from 'koa'
import * as cors from 'koa2-cors'
import { logger } from '~models/logger'
import * as middleware from './middleware'
import { router } from './router'

const app = new Koa()

app
  .use(cors())
  .use(middleware.createRequestLogger())
  .use(router.routes())
  .use(router.allowedMethods())

app.on('error', (err: Error, ctx: Koa.Context) => {
  if (process.env.NODE_ENV !== 'test') {
    logger.error('Server error', { error: err.message })
    logger.error(ctx.originalUrl)
  }
})

export { app as server }
