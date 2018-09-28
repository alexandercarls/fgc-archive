import * as Joi from 'joi'
import { URL } from 'url'
import { config } from './config'
import { transporter } from './transporter'

interface Register {
  to: string
  activationToken: string
}

const registerSchema = Joi.object({
  to: Joi.string().email().required(),
  activationToken: Joi.string().required(),
}).required()

export function register(data: Register): Promise<any> {
  const { to, activationToken } = Joi.attempt(data, registerSchema)
  const activateUrl = new URL(`/auth/register/activate/${activationToken}`, config.clientBaseUrl)

  // Send activation email
  const mailOptions = {
    to,
    from: config.auth.user,
    subject: 'Account activation',
    text: `You are receiving this email because you have requested account activation.\n\n
     Please click on the following link, or paste this into your browser to complete the process:\n\n
     ${activateUrl}\n\n
     If you did not request this, please ignore this email\n`
  }
  return transporter.sendMail(mailOptions)
}
