import React from "react"

const Persons = ({ persons, onClickDelete }) => persons.map((person) =>
  <div key={person.name}> {person.name} {person.number} <button onClick={() => { onClickDelete(person) }}>delete</button> </div>
)

export default Persons