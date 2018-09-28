import * as Joi from 'joi'
import { logger } from '~models/logger'
import * as Mail from '~models/mail'

interface Register {
  date: Date
  email: string
  activationToken: string
}
const schema = Joi.object({
  date: Joi.date().raw().required(),
  email: Joi.string().email().required(),
  activationToken: Joi.string().min(4).required(),
}).required()

export async function register(message: Register): Promise<void> {
  logger.debug('register: received', message)

  let data
  try {
    data = Joi.attempt(message, schema)
  } catch (err) {
    logger.error('register: invalid message', {
      data: message,
      error: err.message
    })

    return
  }

  await Mail.register({ to: data.email, activationToken: data.activationToken })
  logger.debug('register: finished', message)
}
