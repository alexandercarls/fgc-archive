import * as Knex from 'knex'
import { addTimestamps } from '../utils'

const tableName = 'users'

export function up(knex: Knex): Knex.SchemaBuilder {
  return knex.schema.createTable(tableName, table => {
    table.uuid('id').notNullable().primary()
    table.string('email').notNullable().unique()
    table.string('name')
    table.string('password')
    table.boolean('active')
    table.string('activationToken')
    addTimestamps(knex, table)
  })
}

export function down(knex: Knex): Knex.SchemaBuilder {
  return knex.schema.dropTableIfExists(tableName)
}
