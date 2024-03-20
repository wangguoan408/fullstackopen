const { describe, test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')

const Blog = require('../models/blog')
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

describe('CRUD test', () => {
  describe('R - Read:', () => {
    test('blogs are returned as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/) // 正则表达式
    })

    test('the unique identifier is named id', async () => {
      const response = await api.get('/api/blogs')
      const blogs = response.body

      if (blogs) {
        blogs.forEach((blog) => {
          assert(blog?.id)
          assert(!blog?._id)
        })
      }
    })
  })

  describe('C - Create:', () => {
    test('a valid blog can be added', async () => {
      const newBlog = helper.generateRandomBlog()

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogs = await Blog.find({})

      assert.strictEqual(helper.initialBlogs.length + 1, blogs.length) // 长度 + 1
      // 存在符合要求的对象
      assert(
        blogs.some((blog) => {
          return helper.compareBlogs(blog, newBlog)
        })
      )
    })

    test('post blog without likes', async () => {
      const newBlog = helper.generateRandomBlog()
      delete newBlog.likes // 删除 likes 属性

      await api.post('/api/blogs').send(newBlog)

      const blogs = await Blog.find(newBlog)
      // console.log(`finded blog: ${blogs[0]}`)
      assert.strictEqual(blogs[0].likes, 0) // 默认 post 功能正常
    })

    test('post blog without title, return status 400', async () => {
      const newBlog = helper.generateRandomBlog()
      delete newBlog.title // 删除 title 属性

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    })
  })

  describe('D - Delete:', () => {
    test('delete an existed blog', async () => {
      const blogsAtStart = await Blog.find({})
      const blogToDelete = blogsAtStart[0]

      await api.delete(`/api/blogs/${blogToDelete._id.toString()}`).expect(204)

      const blogsAtEnd = await Blog.find({})

      assert.strictEqual(blogsAtStart.length - 1, blogsAtEnd.length)

      const ids = blogsAtEnd.map((blog) => blog._id)
      assert(!ids.some((id) => id.toString() === blogToDelete._id.toString()))
    })

    test('delete an unexisted blog', async () => {
      const fakeId = await helper.nonExistingId() // don't forget the `await`
      await api.delete(`/api/blogs/${fakeId}`).expect(404)
    })
  })

  describe('U - Update:', () => {
    test('update likes', async () => {
      const blogsAtStart = await (await api.get('/api/blogs')).body
      const blogUpdated = {
        ...blogsAtStart[0],
        likes: Math.floor(Math.random() * 100),
      }

      await api
        .put(`/api/blogs/${blogUpdated.id}`)
        .send(blogUpdated)
        .expect(200)

      const updatedBlog = await Blog.findById(blogUpdated.id)
      assert.strictEqual(blogUpdated.likes, updatedBlog.likes)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
