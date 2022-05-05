import React from "react"



const PersonForm = ({ valueName, onChangeName, valueNumber, onChangeNumber, onClickSubmit }) => {
  return (
    <form>
      <div>
                name: <input value={valueName} onChange={onChangeName} />
      </div>
      <div>
                number: <input value={valueNumber} onChange={onChangeNumber} />
      </div>
      <div>
        <button type="submit" onClick={onClickSubmit}>add</button>
      </div>
    </form>
  )
}

export default PersonForm