import { createTransport } from 'nodemailer'
import { config } from './config'

// TODO: Type from config
const transporter = createTransport(config as any)

export { transporter }
