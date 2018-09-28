import { config } from './config'
import { db } from './db'

export function healthCheck(): PromiseLike<boolean> {
  return db.select(1 as any)
    .timeout(config.healthCheck.timeout)
    .then((res: any) => !!res)
}
