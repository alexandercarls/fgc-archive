import * as Joi from 'joi'

interface Config {
  WORKER_PORT: number
}

const envVarsSchema = Joi.object({
  WORKER_PORT: Joi.number().integer().min(0).max(65535)
  .required()
}).unknown()
  .required()

const envVars = Joi.attempt(process.env as any as Config, envVarsSchema)

export const config = {
  port: envVars.WORKER_PORT
}
