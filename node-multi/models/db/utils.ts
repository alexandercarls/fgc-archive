import * as Knex from 'knex'
import { DomainError } from '../errors'

interface PostgresError extends Error {
  code: number
  detail: string
}

export function catchPGerror(err: PostgresError): void {
  if (+err.code === 23505) { // PostgreSQL UNIQUE
    // We only use the key and not the value
    // as it might leak sensible data
    const [key] = err.detail.match(/\(.+?\)/g) as string[]
    let path = 'unknown'
    if (key) {
      path = key.substr(1, key.length - 2)
    }
    throw new DomainError(`${path} has already been taken`)
  }

  throw err
}

export function addTimestamps(knex: Knex, table: Knex.TableBuilder): void {
  table.timestamp('createdAt').defaultTo(knex.fn.now())
  table.timestamp('updatedAt').defaultTo(knex.fn.now())
}
