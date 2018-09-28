import * as Redis from 'ioredis'
import { config } from './config'

export enum Channel {
  register = 'fgc.collect.register'
}

export const publisher = new Redis(config.uri, { lazyConnect: true, dropBufferSupport: true })
export const subscriber = new Redis(config.uri, { lazyConnect: true, dropBufferSupport: true })

export function publishObject(channel: Channel, message: any): PromiseLike<number> {
  return publisher.publish(channel, JSON.stringify(message))
}

export async function destroy(): Promise<void> {
  await subscriber.disconnect()
  await publisher.disconnect()
}
