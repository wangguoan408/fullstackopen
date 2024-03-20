// Packages
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')

// Utilities
const config = require('./utils/config')
const middlewares = require('./utils/middlewares')

// Controllers
const loginRouter = require('./controllers/login')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')

mongoose.connect(config.MONGODB_URI)

const app = express()

// Use middlewares
app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))

app.use(middlewares.tokenExtractor)
app.use('/api/login', loginRouter)
app.use('/api/blogs', middlewares.userExtractor, blogsRouter)
app.use('/api/users', usersRouter)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(middlewares.errorHandler)

module.exports = app
