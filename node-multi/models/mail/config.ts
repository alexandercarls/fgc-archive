import * as Joi from 'joi'

const envVarsSchema = Joi.object({
  SMTP_HOST: Joi.string().required(),
  SMTP_PORT: Joi.number().integer().min(0).max(65535),
  SMTP_USER: Joi.string().required(),
  SMTP_PASSWORD: Joi.string().required(),
  CLIENT_BASE_URL: Joi.string().required()
}).unknown()
  .required()

const envVars = Joi.attempt(process.env, envVarsSchema)

//  nodemailer transport config
const config = {
  host: envVars.SMTP_HOST,
  port: envVars.SMTP_PORT,
  secure: false,
  socketTimeout: 5000,
  logger: true,
  auth: {
    user: envVars.SMTP_USER,
    pass: envVars.SMTP_PASSWORD
  },
  clientBaseUrl: envVars.CLIENT_BASE_URL
}

export { config }
