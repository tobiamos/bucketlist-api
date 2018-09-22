require('dotenv').config({ path: '.env' });
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
require('./src/models');

const { sendJSONResponse } = require('./src/helpers');
const chalk = require('./src/handlers/chalk');
const logger = require('./src/handlers/logger');
const config = require('./src/config');
const apiRoutes = require('./src/routes');
const docs = require('./docs/swagger');

const app = express();

const corsOptions = {
  origin: ['http://localhost:4200'],
  methods: ['OPTIONS', 'GET', 'PUT', 'POST', 'DELETE'],
  credentials: true,
};
app.use(helmet());
app.use(cors(corsOptions));
if (config.env !== 'test') {
  app.use(morgan('dev', { stream: logger.stream }));
}
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(docs));

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '50mb' }));
app.use('/api/v1', apiRoutes);
app.use((req, res, next) => {
  const err = new Error('We apologize, there seems to be a problem with your request.');
  err.status = 404;
  next(err);
});
app.use((err, req, res, next) => { //eslint-disable-line
  if (config.env !== 'test') {
    logger.error(`Internal Server Error ${err.message}`);
  }
  if (err.isBoom) {
    const { message } = err.data[0];
    sendJSONResponse(res, err.output.statusCode, null, req.method, message);
  } else if (err.status === 404) {
    sendJSONResponse(res, err.status, null, req.method, 'We apologize, there seems to be a problem with your request.');
  } else {
    sendJSONResponse(res, 500, null, req.method, 'Something Went Wrong!');
  }
});

app.listen(config.port, () => logger.info(chalk.blue(`App Running on ${config.port}`)));

module.exports = { app };
