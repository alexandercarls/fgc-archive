import * as Joi from 'joi'
import * as fp from 'lodash/fp'
import * as uuid from 'uuid/v4'
import { db } from '../db'
import { catchPGerror } from '../db/utils'

export const tableName = 'fighters'
const returnFields = ['id', 'displayName', 'fullName']

export interface Fighter {
  id: string
  displayName: string
  fullName: string
}

interface Create {
  rbnorwayId: string
  displayName: string
  fullName: string
}
const createSchema = Joi.object({
  rbnorwayId: Joi.string().required(),
  displayName: Joi.string().required(),
  fullName: Joi.string().required(),
}).required()
export async function create(params: Create): Promise<Fighter> {
  const data = Joi.attempt(params, createSchema)
  const id = uuid()

  return db(tableName)
    .insert({
      ...data,
      id
    })
    .returning(returnFields)
    .catch(catchPGerror)
    .then((fighters: Fighter[]) => fp.first(fighters)!)
}

export interface CreateMove {
  fighterId: string
  importHash: string
  notation: string
  hitLevel: string
  damage: string
  startup: string
  onBlock: string
  onHit: string
  onCounterHit: string
  notes: string
}
const addMoveSchema = Joi.object({
  fighterId: Joi.string().uuid({ version: 'uuidv4'}).required(),
  importHash: Joi.string().required(),
  notation: Joi.string().required().trim(),
  hitLevel: Joi.string().allow('').trim(),
  damage: Joi.string().allow('').trim(),
  startup: Joi.string().allow('').trim(),
  onBlock: Joi.string().allow('').trim(),
  onHit: Joi.string().allow('').trim(),
  onCounterHit: Joi.string().allow('').trim(),
  notes: Joi.string().allow('').trim()
}).required()
export async function createMove(params: CreateMove): Promise<void> {
  const data = Joi.attempt(params, addMoveSchema)
  const id = uuid()
  return db('moves')
    .insert({
      ...data,
      id
    })
    .catch(catchPGerror)
}

interface Read {
  id: string
}
const readSchema = Joi.object({
  id: Joi.string().uuid({ version: 'uuidv4' }),
}).required()
export async function read(data: Read): Promise<Fighter | undefined> {
  const selection = Joi.attempt(data, readSchema)

  return db(tableName)
    .where(selection)
    .first(returnFields)
}

export async function list(): Promise<Fighter[]> {
  return db(tableName).select(returnFields)
}

interface Move {
  notation: string
  hitLevel: string
  damage: string
  startup: string
  onBlock: string
  onHit: string
  onCounterHit: string
  notes: string
}
interface ListMoves {
  fighterId: string
}
const listMovesSchema = Joi.object({
  fighterId: Joi.string().uuid({ version: 'uuidv4' }),
}).required()
export async function listMoves(data: ListMoves): Promise<Move[]> {
  const selection = Joi.attempt(data, listMovesSchema)
  const moveFields = ['notation', 'hitLevel', 'damage', 'startup', 'onBlock', 'onHit', 'onCounterHit', 'notes']
  return db('moves').select(moveFields).where(selection)
}
