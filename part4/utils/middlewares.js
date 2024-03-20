const jwt = require('jsonwebtoken')

const User = require('../models/user')
const logger = require('../utils/logger')

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.startsWith('Bearer '))
    req.token = authorization.replace('Bearer ', '')
  next()
}

const userExtractor = async (req, res, next) => {
  if (req.token) {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    if (!decodedToken.id)
      return res.status(401).json({ error: 'token invalid' })

    const user = await User.findById(decodedToken.id.toString())
    if (!user) return res.status(401).json({ error: 'user invalid' })
    req.user = user
  } else {
    return res.status(401).json({ error: 'unauthorized' })
  }
  next()
}

const errorHandler = (err, req, res, next) => {
  logger.error(err) // 打印错误信息

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  } else if (
    err.name === 'MongoServerError' &&
    err.message.includes('E11000 duplicate key error')
  ) {
    return res.status(400).json({ error: 'expected `username` to be unique' })
  } else if (err.name === 'JsonWebTokenError') {
    return res.status(400).json({ error: 'token missing or invalid' })
  }

  next(err) // 传递给下一个 middleware
}

module.exports = { tokenExtractor, userExtractor, errorHandler }
