import * as winston from 'winston'
import { config } from '../../config'

// Configure custom app-wide logger
let logger: winston.LoggerInstance

// Test uses a different logger
if (config.env === 'test') {
  logger = new winston.Logger({
    levels: {
      test: 0, error: 1, warn: 2, info: 3, verbose: 4, debug: 5, silly: 6
    },
    level: config.logger.level,
    transports: [
      new winston.transports.Console({
        colorize: true,
        prettyPrint: true
      })
    ]
  })
  winston.addColors({
    test: 'cyan', error: 'red', warn: 'yellow', info: 'cyan', verbose: 'cyan', debug: 'blue', silly: 'magenta'
  })
} else {
  logger = new winston.Logger({
    level: config.logger.level,
    transports: [
      new winston.transports.Console({
        colorize: true,
        timestamp: true,
        prettyPrint: config.env === 'development'
      })
    ]
  })
}

export { logger }
