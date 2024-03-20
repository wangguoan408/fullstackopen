const { describe, test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')

const User = require('../models/user')
const config = require('../utils/config')
const helper = require('../tests/test_helper')

// The tests only use the Express application defined in the app.js file, which does not listen to any ports:
const app = require('../app')
const api = supertest(app)

beforeEach(async () => {
  mongoose.connect(config.MONGODB_URI)
  await Blog.deleteMany({}) // 清空数据库

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

describe('')

after(async () => {
  await mongoose.connection.close()
})
