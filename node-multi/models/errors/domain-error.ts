export class DomainError extends Error {
  public extra: any

  constructor(message: string, extra?: any) {
    super(message)
    this.name = this.constructor.name
    this.extra = extra
  }
}
