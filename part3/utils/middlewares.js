const logger = require('./logger');

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method);
  logger.info('Path:  ', request.path);
  logger.info('Body:  ', request.body);
  logger.info('---');
  next();
};

// 若未知节点处理放在 HTTP 请求处理之前, 会使所有请求返回 404
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
  // 不用传递给下一个 middleware (即 errorHandler)
};

// 错误处理应该放在最后 (不需要提前声明)
const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error); // 传递给下一个 middleware
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
};
