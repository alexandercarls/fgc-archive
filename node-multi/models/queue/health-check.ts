import { publisher, subscriber } from './queue'

export async function healthCheck(): Promise<true> {
  try {
    await Promise.all<any>([
      // check first if not connected yet (lazy connect)
      subscriber.status === 'wait' ? Promise.resolve() : subscriber.ping(),
      publisher.status === 'wait' ? Promise.resolve() : publisher.ping()
    ])
    return true
  } catch (err) {
    const error = new NotHealthyError('One or more client status are not healthy',
      {
        subscriber: subscriber.status,
        publisher: publisher.status
      })
    throw error
  }
}

interface Status {
  subscriber: string,
  publisher: string
}

class NotHealthyError extends Error {
  public status: Status

  constructor(message: string, status: Status) {
    super(message)
    this.name = this.constructor.name
    this.status = status
  }
}

