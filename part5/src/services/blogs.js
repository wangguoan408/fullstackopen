import axios from 'axios'
const baseUrl = '/api/blogs'

// 对于 service 不要防御式编程
const getAll = async (token) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  }
  const response = await axios.get(baseUrl, { headers })
  return response.data
}

const createBlog = async (token, title, author, url) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  }
  const response = await axios.post(
    baseUrl,
    { title, author, url },
    { headers }
  )
  return response.data
}

const updateBlog = async (token, blogId, updateProps) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  }
  const response = await axios.put(`${baseUrl}/${blogId}`, updateProps, {
    headers,
  })
  return response.data
}

const deleteBlog = async (token, blogId) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  }
  console.log('deleting...')
  const response = await axios.delete(`${baseUrl}/${blogId}`, { headers })
  return response
}

export default { getAll, createBlog, updateBlog, deleteBlog }
