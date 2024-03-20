const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const helper = require('./test_helper')

const listWithNoBlog = []

const listWithOneBlog = helper.initialBlogs[0]

const listWithFewBlogs = helper.initialBlogs

describe('total likes', () => {
  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('when list has more than one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithFewBlogs)
    assert.strictEqual(result, 36)
  })
})

describe('favorite blog', () => {
  // 判断两个 Object 是否相等(属性和值均相等), 使用 deepStrictEqual 函数
  test('when list is empty', () => {
    assert.deepStrictEqual(listHelper.favoriteBlog(listWithNoBlog), {})
  })

  test('when list has only one blog', () => {
    assert.deepStrictEqual(listHelper.favoriteBlog(listWithOneBlog), {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 5,
    })
  })

  test('when list has more than one blog', () => {
    assert.deepStrictEqual(listHelper.favoriteBlog(listWithFewBlogs), {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12,
    })
  })
})

describe('most blogs author', () => {
  // 判断两个 Object 是否相等(属性和值均相等), 使用 deepStrictEqual 函数
  test('when list is empty', () => {
    assert.deepStrictEqual(listHelper.mostBlogs(listWithNoBlog), {})
  })

  test('when list has only one blog', () => {
    assert.deepStrictEqual(listHelper.mostBlogs(listWithOneBlog), {
      author: 'Edsger W. Dijkstra',
      blogs: 1,
    })
  })

  test('when list has more than one blog', () => {
    assert.deepStrictEqual(listHelper.mostBlogs(listWithFewBlogs), {
      author: 'Robert C. Martin',
      blogs: 3,
    })
  })
})

describe('most likes author', () => {
  // 判断两个 Object 是否相等(属性和值均相等), 使用 deepStrictEqual 函数
  test('when list is empty', () => {
    assert.deepStrictEqual(listHelper.mostLikes(listWithNoBlog), {})
  })

  test('when list has only one blog', () => {
    assert.deepStrictEqual(listHelper.mostLikes(listWithOneBlog), {
      author: 'Edsger W. Dijkstra',
      likes: 5,
    })
  })

  test('when list has more than one blog', () => {
    assert.deepStrictEqual(listHelper.mostLikes(listWithFewBlogs), {
      author: 'Edsger W. Dijkstra',
      likes: 17,
    })
  })
})
