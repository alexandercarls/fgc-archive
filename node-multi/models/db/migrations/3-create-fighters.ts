import * as Knex from 'knex'
import { addTimestamps } from '../utils'

const fighters = 'fighters'

export function up(knex: Knex): Knex.SchemaBuilder {
  return knex.schema
    .createTable(fighters, table => {
      table.uuid('id').notNullable().primary()
      table.string('rbnorwayId').notNullable().unique()
      table.string('displayName').notNullable().unique()
      table.string('fullName').notNullable().unique()
      table.index(['displayName'])
      addTimestamps(knex, table)
    })
}

export function down(knex: Knex): Knex.SchemaBuilder {
  return knex.schema
    .dropTableIfExists(fighters)
}
