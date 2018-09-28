import * as Joi from 'joi'

const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(['development', 'production', 'test'])
    .default('production'),
  PROCESS_TYPE: Joi.string()
    .allow(['web', 'worker'])
    .required(),
  LOGGER_LEVEL: Joi.string()
    .allow(['test', 'error', 'warn', 'info', 'verbose', 'debug', 'silly'])
    .when('NODE_ENV', {
      is: 'development',
      then: Joi.string().default('silly'),
    })
    .when('NODE_ENV', {
      is: 'production',
      then: Joi.string().default('info'),
    })
    .when('NODE_ENV', {
      is: 'test',
      then: Joi.string().default('test'),
    }),
}).unknown()
  .required()

const envVars = Joi.attempt(process.env, envVarsSchema)

const config = {
  env: envVars.NODE_ENV,
  process: {
    type: envVars.PROCESS_TYPE,
  },
  logger: {
    level: envVars.LOGGER_LEVEL,
  },
}

export { config }
