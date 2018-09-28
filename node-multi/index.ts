// load .env in local development
if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({ path: '../.env' })
}

import * as semver from 'semver'
import { config } from './config'
import { logger } from './models/logger'

// validate Node version requirement
const pkg = require('../package.json')
const runtime = {
  expected: semver.validRange(pkg.engines.node),
  actual: semver.valid(process.version),
}
const valid = semver.satisfies(runtime.actual!, runtime.expected)
if (!valid) {
  throw new Error(
    `Expected Node.js version ${runtime.expected}, but found v${runtime.actual}. Please update or change your runtime!`,
  )
}

// start process
logger.info(`Starting ${config.process.type} process`, {
  pid: process.pid,
  env: config.env,
})

if (config.process.type === 'web') {
  require('./web')
} else if (config.process.type === 'worker') {
  require('./worker')
} else {
  throw new Error(`${config.process.type} is an unsupported process type.`)
}
