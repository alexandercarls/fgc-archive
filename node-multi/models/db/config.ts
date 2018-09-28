import * as Joi from 'joi'
import { ConnectionConfig } from 'knex'
import * as path from 'path'
import { parse } from 'pg-connection-string'

interface Env {
  NODE_ENV: string
  DATABASE_URI: string
  DATABASE_TEST_URI: string
  POSTGRES_POOL_MIN: string
  POSTGRES_POOL_MAX: string
  POSTGRES_HEALTH_CHECK_TIMEOUT: string
}

const envVarsSchema = Joi.object({
  // We can't import top-level config, since that would validate for
  // PROCESS_TYPE, which we don't want to have here
  NODE_ENV: Joi.string()
    .allow(['development', 'production', 'test'])
    .default('production'),
  DATABASE_URI: Joi.string().uri({ scheme: 'postgres' }).required(),
  DATABASE_TEST_URI: Joi.string().uri({ scheme: 'postgres' }).required(),
  POSTGRES_POOL_MIN: Joi.number().integer().default(1),
  POSTGRES_POOL_MAX: Joi.number().integer().default(20),
  POSTGRES_HEALTH_CHECK_TIMEOUT: Joi.number().integer().default(2000)
}).unknown()
  .required()

const envVars = Joi.attempt(process.env as any as Env, envVarsSchema)

export const config = {
  client: 'pg',
  connection: (envVars.NODE_ENV === 'test' ? parse(envVars.DATABASE_TEST_URI) : parse(envVars.DATABASE_URI)) as ConnectionConfig,
  pool: {
    min: +envVars.POSTGRES_POOL_MIN,
    max: +envVars.POSTGRES_POOL_MAX
  },
  migrations: {
    directory: path.join(__dirname, './migrations')
  },
  seeds: {
    directory: path.join(__dirname, '../../tests/seeds'),
  },
  healthCheck: {
    timeout: +envVars.POSTGRES_HEALTH_CHECK_TIMEOUT
  }
}

