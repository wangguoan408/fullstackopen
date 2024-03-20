const Notification = ({ notification }) => {
  const infoStyle = { color: 'green' }
  const errStyle = { color: 'red' }

  if (!notification.message) return null
  return (
    <div
      className="notification"
      style={notification.type === 'info' ? infoStyle : errStyle}
    >
      {notification.message}
    </div>
  )
}

export default Notification
