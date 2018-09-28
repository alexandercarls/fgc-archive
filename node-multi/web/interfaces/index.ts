// DO NOT MODIFY THIS FILE FROM THE CLIENT
// IT IS COPIED OVER FROM THE WEB API VIA `npm run copy-api-interfaces`

export interface UserResponse {
  id: string
  email: string
  name?: string
  createdAt: number
}

export interface FighterResponse {
  id: string
  displayName: string
  fullName: string
}

export interface MoveResponse {
  notation: string
  hitLevel: string
  damage: string
  startup: string
  onBlock: string
  onHit: string
  onCounterHit: string
  notes: string
}

export interface LoginResponse {
  user: UserResponse,
  jwt: any, // TODO type it properly
}
