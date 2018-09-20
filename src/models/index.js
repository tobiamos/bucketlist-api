const mongoose = require('mongoose');
const glob = require('glob');
const winston = require('winston');

mongoose.Promise = global.Promise;
const config = require('../config');
const chalk = require('../handlers/chalk');

const DBURI = config.db;

const options = {
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 500,
  poolSize: 10,
  bufferMaxEntries: 0,
  useNewUrlParser: true,
};

mongoose.connect(DBURI, options);
if (config.env === 'development') {
  mongoose.set('debug', true);
}

mongoose.connection.on('connected', () => {
  winston.info(chalk.blue('Connected to '), DBURI);
});

mongoose.connection.on('error', (err) => {
  winston.info(chalk.error('ERRROR CONNECTING'), {
    err,
  });
});

mongoose.connection.on('disconnected', () => {
  winston.info(chalk.error('Disconnected From '), DBURI);
});

const modelspath = 'src/models/**/*.js';
const removeIndex = el => el !== 'src/models/index.js';

glob
  .sync(modelspath)
  .filter(removeIndex)
  .forEach((model) => {
    const $model = model.split('/');
    require(`./${$model[2]}/${$model[3]}`); // eslint-disable-line
    winston.info(chalk.blue(`loaded ${model}`));
  });
