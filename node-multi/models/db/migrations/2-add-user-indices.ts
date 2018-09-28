import * as Knex from 'knex'

const userTableName = 'users'

export function up(knex: Knex): Knex.SchemaBuilder {
  return knex.schema.alterTable(userTableName, table => {
    table.index(['email'])
  })
}

export function down(knex: Knex): Knex.SchemaBuilder {
  return knex.schema.alterTable(userTableName, table => {
    table.dropIndex(['email'])
  })
}
