import * as Knex from 'knex'
import { f1, f2 } from '../fixtures/fighters'

export function seed(knex: Knex): PromiseLike<any> {
  const tableName = 'fighters'
  return knex(tableName).del()
    .then(() =>
      knex(tableName).insert([f1, f2]))
}
