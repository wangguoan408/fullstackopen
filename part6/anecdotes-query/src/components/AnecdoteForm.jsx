import { useQueryClient, useMutation } from "@tanstack/react-query"
import { createAnecdote } from "../requests"
import { useNotifDispatch } from "../contexts/NotifContext"

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const AnecdoteForm = () => {

  const notifDispatch = useNotifDispatch()

  const queryClient = useQueryClient()

  const newAnecMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
    },
    onError: () => {
      notifDispatch({
        type: 'SET_NOTIF',
        content: `too short anecdote, must have length 5 or more`
      })
      setTimeout(() => {
        notifDispatch({ type: 'CLEAR_NOTIF' })
      }, 5000)
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecMutation.mutate(asObject(content))

    // 显示通知
    notifDispatch({
      type: 'SET_NOTIF',
      content: `new anecdote ${content}`
    })
    setTimeout(() => {
      notifDispatch({ type: 'CLEAR_NOTIF' })
    }, 5000)
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
