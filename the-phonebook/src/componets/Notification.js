import React from "react"

const Notification = (props) => {
  const { message, color } = props.msgObj
  if (message === null) {
    return null
  }

  const notifyStyle = {
    color: color,
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  return (
    <div style={notifyStyle}>
      <em>{message}</em>
    </div>
  )
}

export default Notification