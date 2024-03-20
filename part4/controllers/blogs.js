const jwt = require('jsonwebtoken')

const User = require('../models/user')

require('express-async-errors')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const { title, author, url, likes } = request.body
  const user = request.user

  const blog = new Blog({
    title: title,
    author: author,
    url: url,
    likes: likes || 0,
    user: user._id,
  })

  await blog.save()
  const savedBlog = await blog.populate('user', { username: 1, name: 1 })
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save() // update

  response.status(201).json(savedBlog)
})

blogsRouter.put('/:id', async (request, response) => {
  const blog = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { $set: blog },
    {
      new: true,
      runValidators: true,
      context: 'query',
    }
  ).populate('user', { username: 1, name: 1 })

  response.status(200).json(updatedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const blogToDel = await Blog.findById(request.params.id)
  if (!blogToDel) return response.status(404).end()

  const user = request.user
  if (blogToDel.user.toString() !== user._id.toString())
    return response.status(401).json({ error: 'token incorrect' })

  await blogToDel.deleteOne()
  user.blogs = user.blogs.filter(
    (blogId) => blogId.toString() !== blogToDel._id.toString()
  )
  await user.save()

  response.status(204).json(blogToDel) // `.json(blogToDel)`不起效
})

module.exports = blogsRouter
