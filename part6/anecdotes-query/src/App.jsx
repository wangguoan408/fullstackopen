import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'

import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'

import { getAnecdotes, udpateAnecdote } from './requests'
import { useNotifDispatch } from './contexts/NotifContext'

const App = () => {

  const notifDispatch = useNotifDispatch()

  const queryClient = useQueryClient()

  const updateAnecMutation = useMutation({
    mutationFn: udpateAnecdote,
    onSuccess: (updatedAnecdote) => {
      const id = updatedAnecdote.id
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(
        ['anecdotes'],
        anecdotes.map(anecdote => anecdote.id === id ? updatedAnecdote : anecdote)
      )
    }
  })

  const handleVote = (anecdote) => {
    const updatedAnecdote = {
      ...anecdote,
      votes: anecdote.votes + 1
    }
    updateAnecMutation.mutate(updatedAnecdote)

    // 显示通知
    notifDispatch({
      type: 'SET_NOTIF',
      content: `anecdote '${anecdote.content}' voted`
    })
    setTimeout(() => {
      notifDispatch({ type: 'CLEAR_NOTIF' })
    }, 5000)
  }

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1 // 也可以定义为 retry: false 不尝试重新获取数据
  })

  if (result.isLoading) {
    return <div>loading data...</div>
  }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
