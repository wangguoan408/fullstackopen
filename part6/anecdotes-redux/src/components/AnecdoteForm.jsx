import { useDispatch } from "react-redux";
import { createAnecdote } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer"

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const addNewAnecdote = async (event) => {
    event.preventDefault() // 屏蔽默认的表单提交操作
    const content = event.target.anecdote.value
    event.target.anecdote.value = '' // clear
    dispatch(createAnecdote(content))
    dispatch(setNotification(`new anecdote ${content}`, 3))
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addNewAnecdote}>
        <div><input name='anecdote' /></div>
        <button>create</button>
      </form>
    </>
  )
}

export default AnecdoteForm