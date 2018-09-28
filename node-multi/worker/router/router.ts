import * as Router from 'koa-router'
import * as health from './health'

export const router = new Router()

router.get('/health', health.get)
