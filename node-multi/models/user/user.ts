import * as bcrypt from 'bcryptjs'
import * as crypto from 'crypto'
import * as Joi from 'joi'
import * as fp from 'lodash/fp'
import * as util from 'util'
import * as uuid from 'uuid/v4'
import { db } from '../db'
import { AuthenticationError } from '../errors'
import * as queue from '../queue'

export const tableName = 'users'
const userFields = ['id', 'email', 'name', 'createdAt']
const nameValidation = Joi.string().min(3)
const passwordVaidation = Joi.string().min(5)

const { Channel } = queue

export interface User {
  id: string
  email: string
  name?: string
  createdAt: number
}

interface Register {
  name: string
  email: string
  password: string
}

// TODO: Refactor common validation
const registerSchema = Joi.object({
  name: nameValidation,
  email: Joi.string().email().lowercase().required(),
  password: passwordVaidation.required(),
}).required()

export async function register(data: Register): Promise<User> {
  const user = Joi.attempt(data, registerSchema)

  const userInDb = await db(tableName)
    .where({ email: user.email })
    .first(['password', 'id'])

  if (userInDb) {
    throw new AuthenticationError(`User with ${user.email} already exists`)
  }

  const randomBytes = util.promisify(crypto.randomBytes)
  const [password, cryptedValue] = await Promise.all([
    hashPassword(user.password),
    randomBytes(16)
  ])
  const activationToken = cryptedValue.toString('hex')
  const id = uuid()

  await queue.publishObject(Channel.register, {
    email: user.email,
    activationToken,
    date: new Date().toISOString()
  })

  return db(tableName)
    .insert({
      ...user,
      id,
      password,
      activationToken
    })
    .returning(userFields)
    .then((users: User[]) => fp.first(users)!)
}

function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

interface Activate {
  activationToken: string
}
const activateSchema = Joi.object({
  activationToken: Joi.string().min(4).required()
}).required()

export function activate(data: Activate): PromiseLike<User | undefined> {
  const { activationToken } = Joi.attempt(data, activateSchema)

  return db(tableName)
    .update({ active: true })
    .where({ activationToken })
    .returning(userFields)
    .then((users: User[]) => fp.first(users))
}

interface Update {
  id: string
  name?: string
  email?: string
  password?: string
}
const updateSchema = Joi.object({
  id: Joi.string().uuid({ version: 'uuidv4' }).required(),
  name: nameValidation,
  email: Joi.string().email().lowercase(),
  password: passwordVaidation,
}).required()
export async function update(data: Update): Promise<User | undefined> {
  const user = Joi.attempt(data, updateSchema)
  if (user.password) {
    user.password = await hashPassword(user.password)
  }

  return db(tableName)
    .update(user)
    .where({ id: user.id })
    .returning(userFields)
    .then((users: User[]) => fp.first(users))
}

interface Read {
  id: string
}

const readSchema = Joi.object({
  id: Joi.string().uuid({ version: 'uuidv4' }),
}).required()

export async function read(data: Read): Promise<User | undefined> {
  const selection = Joi.attempt(data, readSchema)

  return db(tableName)
    .where(selection)
    .first(userFields)
}

export async function list(): Promise<User[]> {
  return db(tableName).select(userFields)
}

interface Authenticate {
  email: string
  password: string
}

const authSchema = Joi.object({
  email: Joi.string().email().required(),
  password: passwordVaidation.required(),
}).required()

export async function authenticate(data: Authenticate): Promise<User> {
  const { email, password } = Joi.attempt(data, authSchema)

  const user = await db(tableName)
    .where({ email })
    .first(['password', 'id', 'active']) as { password: string, id: string, active: boolean} | undefined

  if (!user) {
    throw new AuthenticationError(`User with email ${email} does not exist`)
  }

  if (!user.active) {
    throw new AuthenticationError(`User with email ${email} is not activated`)
  }

  const { id, password: hash } = user

  const isMatch = await comparePassword(password, hash)
  if (!isMatch) {
    throw new AuthenticationError(`User with email ${email} and password ${password} does not match`)
  }

  // tslint:disable-next-line:no-shadowed-variable
  return read({ id }).then(user => user!)
}

function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}
