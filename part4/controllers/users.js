const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')

const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!password || password.length < 3)
    throw { name: 'ValidationError', message: 'Invalid password' }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username, // instead of `username: username`
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {
    title: 1,
    author: 1,
    url: 1,
  })
  response.status(200).json(users) // 默认的响应应该就是 200
})

module.exports = usersRouter
