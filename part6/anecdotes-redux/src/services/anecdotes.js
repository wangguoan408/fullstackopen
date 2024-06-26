import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const createAnec = async (content) => {
  const response = await axios.post(baseUrl, asObject(content))
  return response.data
}

const updateAnec = async (anecId, updateProps) => {
  const response = await axios.put(`${baseUrl}/${anecId}`, updateProps)
  return response.data
}

export default {
  getAll,
  createAnec,
  updateAnec
}