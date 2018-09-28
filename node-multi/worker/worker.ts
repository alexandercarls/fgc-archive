import { logger } from '~models/logger'
import * as queue from '~models/queue'
import { Channel, publisher, subscriber } from '~models/queue'
import * as handlers from './handlers'

export async function init(): Promise<void> {
  await Promise.all([
    subscriber.connect(),
    publisher.connect()
  ])

  await subscriber.subscribe(Channel.register)

  await subscriber.on('message', (channel: Channel | string, message: any) => {
    let messageObject
    try {
      messageObject = JSON.parse(message)
    } catch (err) {
      logger.warn('Invalid message, failed to parse', {
        message,
        error: err.message
      })
      return
    }

    switch (channel) {
      case Channel.register:
        handlers.register(messageObject)
          .catch(logError)
        break
      default:
        logger.warn(`Queue message is not handled on channel '${channel}'`, message)
    }

    function logError(err: Error): void {
      logger.debug('Message handling error', {
        message,
        error: err.message
      })
    }
  })

  logger.info('Channels are initialized')
}

export async function halt(): Promise<void> {
  await queue.destroy()
  logger.info('Channels are canceled')
}
