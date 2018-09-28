import * as http from 'http'
import { promisify } from 'util'
import { db } from '~models/db'
import { logger } from '~models/logger'
import * as queue from '~models/queue'
import { config } from './config'
import { server as app } from './server'
import * as worker from './worker'

const server = http.createServer(app.callback())
const serverListen = promisify(server.listen).bind(server)
const serverClose = promisify(server.close).bind(server)

Promise.all([worker.init(), serverListen(config.port)])
  .then(() => {
    logger.info('Worker is running')
    logger.info(`Server is listening on port ${config.port}`)
  })
  .catch((err) => {
    logger.error('Error happened during worker initialization', err)
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
    await queue.destroy()
    await db.destroy()
    await serverClose()
  } catch (err) {
    logger.error('Error happened during graceful shutdown', err)
    process.exit(1)
  }

  logger.info('Graceful shutdown finished')
  process.exit()
}
