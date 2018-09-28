import * as Joi from 'joi'

interface Config {
  API_PORT: number
  JWT_DURATION: string
  JWT_SECRET: string
}

const envVarsSchema = Joi.object({
  API_PORT: Joi.number().integer().min(0).max(65535)
  .required(),
  JWT_SECRET: Joi.string().required(),
  JWT_DURATION: Joi.string().required()
}).unknown()
  .required()

const envVars = Joi.attempt(process.env as any as Config, envVarsSchema)

export const config = {
  port: envVars.API_PORT,
  jwtSecret: envVars.JWT_SECRET,
  jwtDuration: envVars.JWT_DURATION,
}
