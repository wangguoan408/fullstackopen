import { createSlice } from "@reduxjs/toolkit"

import anecdoteService from '../services/anecdotes'

const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const initialState = anecdotesAtStart.map(asObject)

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState,
  reducers: {
    updateAnec(state, action) {
      const updatedAnecdote = action.payload
      console.log('updatedAnec: ', updatedAnecdote)
      const id = updatedAnecdote.id
      return state
        .map(anecdote => anecdote.id === id ? updatedAnecdote : anecdote)
        .sort((a, b) => b.votes - a.votes)
    },

    appendAnecdote(state, action) {
      state.push(action.payload)
    },

    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { updateAnec, appendAnecdote, setAnecdotes } = anecdoteSlice.actions

export const initialAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes([...anecdotes].sort((a, b) => b.votes - a.votes)))
  }
}

export const createAnecdote = (content) => {
  return async dispatch => {
    // ! 异步函数记得添加 await
    const newAnecdote = await anecdoteService.createAnec(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const updateAnecdote = (anecdoteToChange) => {
  return async dispatch => {
    const anecId = anecdoteToChange.id
    const updateProps = {
      ...anecdoteToChange,
      votes: anecdoteToChange.votes + 1
    }
    const updatedAnecdote = await anecdoteService.updateAnec(anecId, updateProps)
    dispatch(updateAnec(updatedAnecdote))
  }
}

export default anecdoteSlice.reducer