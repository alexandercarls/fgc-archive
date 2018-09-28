import * as Koa from 'koa'
import { logger } from '~models/logger'
import { router } from './router'

const app = new Koa()

app.use(router.routes())

app.on('error', (err) => {
  logger.error('Server error', { error: err.message })
})

export { app as server}
