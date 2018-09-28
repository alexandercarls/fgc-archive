import * as bodyParser from 'koa-bodyparser'
import * as Router from 'koa-router'
import * as middleware from '../middleware'
import * as Fighter from './fighter'
import * as Health from './health'
import * as User from './user'

export const router = new Router()

router
  .use(middleware.errorHandler)
  .use(middleware.jwtHandler)
  .use(middleware.parseQueryFactory({ allowDots: true }))
  .use(bodyParser({ enableTypes: ['json'] }))

router.get('/api/users/me', User.me)
router.get('/api/users', User.list)
router.post('/api/users', User.register)
router.post('/api/users/activate', User.activate)
router.post('/api/users/login', User.login)
router.get('/api/users/:userId', User.get)
router.put('/api/users/:userId', User.update)

router.get('/api/fighters', Fighter.list)
router.get('/api/fighters/:fighterId', Fighter.get)
router.get('/api/fighters/:fighterId/moves', Fighter.listMoves)
router.post('/api/fighters', Fighter.create)

router.get('/health', Health.get)

router.all('*', ctx => ctx.throw(404))
