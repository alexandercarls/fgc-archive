import * as http from 'http'
import { promisify } from 'util'
import { db } from '~models/db'
import { logger } from '~models/logger'
import * as queue from '~models/queue'
import { config } from './config'
import { server as app } from './server'

const server = http.createServer(app.callback())
const serverListen = promisify(server.listen).bind(server)
const serverClose = promisify(server.close).bind(server)

serverListen(config.port)
  .then(() => logger.info(`Server is listening on port ${config.port}`))
  .catch((err: Error) => {
    logger.error('Error happened during server start', err)
    process.exit(1)
  })

process.on('SIGTERM', gracefulShutdown)

let shuttingDown = false
async function gracefulShutdown(): Promise<void> {
  logger.info('Got kill signal, starting graceful shutdown')

  if (shuttingDown) {
    return
  }

  shuttingDown = true
  try {
    await serverClose()
    await db.destroy()
    await queue.destroy()
  } catch (err) {
    logger.error('Error happened during graceful shutdown', err)
    process.exit(1)
  }

  logger.info('Graceful shutdown finished')
  process.exit()
}
