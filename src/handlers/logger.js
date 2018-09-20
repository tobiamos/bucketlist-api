const winston = require('winston');

const config = require('../config/index');

winston.emitErrs = true;

const options = {
  file: {
    level: 'info',
    filename: `${__dirname}/../logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  errorFile: {
    level: 'error',
    filename: `${__dirname}/../logs/error.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

let logger;
if (config.env === 'development' || config.env === 'staging') {
  logger = new winston.Logger({
    transports: [
      new winston.transports.File(options.file),
      new winston.transports.Console(options.console),
    ],
    exitOnError: false,
  });
} else {
  logger = new winston.Logger({
    transports: [new winston.transports.File(options.errorFile)],
    exitOnError: false,
  });
}

logger.stream = {
  write(message, encoding) { // eslint-disable-line
    logger.info(message);
  },
};

module.exports = logger;
