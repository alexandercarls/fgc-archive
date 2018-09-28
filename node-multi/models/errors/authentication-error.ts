import { DomainError } from './domain-error'

export class AuthenticationError extends DomainError {
  constructor(message: string, extra?: any) {
    super(message, extra)
    this.name = this.constructor.name
    this.extra = extra
  }
}
