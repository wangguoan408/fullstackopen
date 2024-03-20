import { useState, useEffect } from 'react'

import Notification from './components/Notification'
import Login from './components/Login'
import Blogs from './components/Blogs'

const App = () => {
  const [user, setUser] = useState({ token: null, username: '' })
  const [notif, setNotif] = useState({ message: null, type: 'info' })

  return (
    <div>
      <Notification notification={notif} />
      {!user.token ? (
        <Login setUser={setUser} setNotification={setNotif} />
      ) : (
        <Blogs user={user} setUser={setUser} setNotification={setNotif} />
      )}
    </div>
  )
}

export default App
