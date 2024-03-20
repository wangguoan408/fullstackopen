import { useState } from 'react'
import blogService from '../services/blogs'

export const Blog = ({ token, blog, onUpdateBlog, handleRemove }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
    lineHeight: 0.5,
  }

  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = async () => {
    try {
      const updatedBlog = await blogService.updateBlog(token, blog.id, {
        likes: blog.likes + 1,
      })
      // console.log(updatedBlog)
      onUpdateBlog(updatedBlog)
    } catch (error) {
      // 不知道有什么潜在的错误
      console.error(error.message)
    }
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}{' '}
      <button onClick={toggleVisibility}>{visible ? 'hide' : 'show'}</button>
      <div style={showWhenVisible}>
        <p>URL: {blog.url}</p>
        <p>
          Likes: {blog.likes} <button onClick={handleLike}>Like</button>
        </p>
        <p>Created by: {blog?.user?.username}</p>
        <button onClick={handleRemove}>remove</button>
      </div>
    </div>
  )
}

export default Blog
