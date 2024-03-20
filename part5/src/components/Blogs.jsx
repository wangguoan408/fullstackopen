import { useState, useEffect, useRef } from 'react'

import blogService from '../services/blogs'

import Togglable from './Togllable'
import Blog from './Blog'

const Input = ({ label, type, id, value, onChange }) => (
  <div>
    <label htmlFor={label}>{label}:</label>
    <input type={type} id={id} value={value} onChange={onChange} />
  </div>
)

const NewBlogForm = ({ token, setNotification, handleCreate }) => {
  const [formData, setFormData] = useState({ title: '', author: '', url: '' })

  const handleCreateBlog = async (event) => {
    event.preventDefault()
    try {
      const createdBlog = await blogService.createBlog(
        token,
        formData.title,
        formData.author,
        formData.url
      )
      handleCreate(createdBlog)
      setNotification({
        message: `a new blog "${formData.title}" by ${formData.author} added`,
        type: 'info',
      })
      setTimeout(() => {
        setNotification({ message: null })
      }, 5000)
      setFormData({ title: '', author: '', url: '' })
    } catch (error) {
      // console.error(error)
      setNotification({ message: error?.response?.data?.error, type: 'error' })
      setTimeout(() => {
        setNotification({ message: null })
      }, 5000)
    }
  }

  const handleChange = (event) => {
    const { id, value } = event.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }))
  }

  return (
    <form onSubmit={handleCreateBlog}>
      <Input
        label="Title"
        type="text"
        id="title"
        value={formData.title}
        onChange={handleChange}
      />
      <Input
        label="Author"
        type="text"
        id="author"
        value={formData.author}
        onChange={handleChange}
      />
      <Input
        label="URL"
        type="text"
        id="url"
        value={formData.url}
        onChange={handleChange}
      />
      <button type="submit">create</button>
    </form>
  )
}

const Blogs = ({ user, setUser, setNotification }) => {
  const [blogs, setBlogs] = useState([])

  const blogFormRef = useRef()

  const sortBlogs = (blogs) => {
    return blogs.sort((a, b) => b.likes - a.likes)
  }

  useEffect(() => {
    const initBlogs = async () => {
      const blogs = await blogService.getAll(user.token)
      setBlogs(sortBlogs(blogs))
    }

    initBlogs()
  }, [user])

  const handleLogout = async (event) => {
    event.preventDefault()
    setUser({ token: null, username: '' })
  }

  const handleBlogCreate = (createdBlog) => {
    setBlogs(blogs.concat(createdBlog))
    blogFormRef.current.toggleVisibility()
  }

  const handleBlogUpdate = (updatedBlog) => {
    const updatedBlogs = blogs.map((blog) =>
      blog.id === updatedBlog.id ? updatedBlog : blog
    )
    setBlogs(sortBlogs(updatedBlogs))
  }

  const handleBlogDelete = async (blogToDel) => {
    const confirmed = confirm(
      `Remove blog ${blogToDel.title} by ${blogToDel.author}`
    )
    if (!confirmed) return null

    try {
      await blogService.deleteBlog(user.token, blogToDel.id)
      setBlogs(blogs.filter((blog) => blog.id !== blogToDel.id))
      setNotification({
        message: `Removed blog ${blogToDel.title} by ${blogToDel.author}`,
        type: 'info',
      })
      setTimeout(() => {
        setNotification({ message: null })
      }, 5000)
    } catch (error) {
      setNotification({ message: error?.response?.data?.error, type: 'error' })
      setTimeout(() => {
        setNotification({ message: null })
      }, 5000)
    }
  }

  return (
    <div id="blogs">
      <h2>blogs</h2>
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>log out</button>
      </p>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          token={user.token}
          blog={blog}
          onUpdateBlog={handleBlogUpdate}
          handleRemove={() => handleBlogDelete(blog)}
        />
      ))}

      <h2>create new</h2>
      <Togglable
        buttonLabelVisible="new blog"
        buttonLabelInvisible="cancel"
        ref={blogFormRef}
      >
        <NewBlogForm
          token={user.token}
          setNotification={setNotification}
          handleCreate={handleBlogCreate}
        />
      </Togglable>
    </div>
  )
}

export default Blogs
