import * as Joi from 'joi'

const envVarsSchema = Joi.object({
  REDIS_URI: Joi.string().uri({ scheme: 'redis' }).required()
}).unknown()
  .required()

const envVars = Joi.attempt(process.env, envVarsSchema)

export const config = {
  uri: envVars.REDIS_URI
}
