import * as jwt from 'jsonwebtoken'

export function signJWT(userId: string, expireDuration: string | number, secret: string): string {
  const payload = {
    id: userId,
  }
  const data = {
    expiresIn: expireDuration,
  }

  return jwt.sign(payload, secret, data)
}
