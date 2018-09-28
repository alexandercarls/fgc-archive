import * as Knex from 'knex'
import { addTimestamps } from '../utils'

const moves = 'moves'

export function up(knex: Knex): Knex.SchemaBuilder {
  return knex.schema.createTable(moves, table => {
    table.uuid('id').notNullable().primary()
    table.uuid('fighterId').notNullable()
    table.foreign('fighterId').references('fighters.id').onDelete('CASCADE')
    table.string('importHash').notNullable()
    table.string('notation').notNullable()
    table.string('hitLevel')
    table.string('damage')
    table.string('startup')
    table.string('onBlock')
    table.string('onHit')
    table.string('onCounterHit')
    table.string('notes')
    addTimestamps(knex, table)
  })
}

export function down(knex: Knex): Knex.SchemaBuilder {
  return knex.schema.dropTableIfExists(moves)
}
