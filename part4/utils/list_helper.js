const fp = require('lodash/fp')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  // 定义了一个匿名的 reducer
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return {}
  // else if (blogs.length === 1) return blogs[0]

  let favorite = blogs[0]
  let maxLikes = blogs[0].likes

  blogs.forEach((blog) => {
    if (blog.likes > maxLikes) {
      favorite = blog
      maxLikes = blog.likes
    }
  })

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return {}

  const authorWithMostBlogs = fp.flow(
    fp.groupBy('author'),
    fp.mapValues(fp.size),
    fp.toPairs,
    fp.maxBy(fp.prop(1))
  )(blogs)

  return {
    author: authorWithMostBlogs[0],
    blogs: authorWithMostBlogs[1],
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return {}

  const authorWithMostLikes = fp.flow(
    fp.groupBy('author'),
    fp.mapValues(fp.sumBy('likes')),
    fp.toPairs,
    fp.maxBy(fp.prop(1))
  )(blogs)

  return {
    author: authorWithMostLikes[0],
    likes: authorWithMostLikes[1],
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
