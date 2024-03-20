const Notification = ({ message, type }) => {
  const successStyle = {
    color: "green",
  };
  const failedStyle = {
    color: "red",
  };

  const appliedStyle = type === "error" ? failedStyle : successStyle;
  if (message === null) {
    return null;
  }

  return (
    <div className="message" style={appliedStyle}>
      {message}
    </div>
  );
};

export default Notification;
