const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

const config = require('./utils/config');
const logger = require('./utils/logger');
const middlewares = require('./utils/middlewares');
const personsRouter = require('./controllers/persons');

const app = express();

app.use(cors()); // 允许跨域请求
app.use(express.json()); // json-parser (json 解析器)
// app.use(express.static('dist')); // 使用本地目录 dist

// 网络请求日志
morgan.token('postdata', (req) => {
  if (req?.route?.stack[0]?.method === 'post') {
    return JSON.stringify(req.body);
  }
  return '';
});

app.use(morgan('tiny'));

// connect MongoDB
mongoose.set('strictQuery', false);
logger.info('connecting to', config.MONGODB_URI);
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message);
  });

app.use('/api/persons', personsRouter);
app.use(middlewares.unknownEndpoint);
app.use(middlewares.errorHandler);

module.exports = app;
