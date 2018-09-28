import * as Knex from 'knex'
import { activatedUser, deactivatedUser } from '../fixtures/users'

export function seed(knex: Knex): PromiseLike<any> {
  const tableName = 'users'
  return knex(tableName).del()
    .then(() =>
      knex(tableName).insert([activatedUser, deactivatedUser]))
}
