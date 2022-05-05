import React, { useState, useEffect } from "react"
import Filter from "./componets/Filter"
import PersonForm from "./componets/PersonForm"
import Persons from "./componets/Persons"
import apiService from "./services/Persons"
import Notification from "./componets/Notification"

const App = () => {
  const [persons, setPersons] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [newName, setNewName] = useState("")
  const [newNumber, setNewNumber] = useState("")
  const [searchName, setSearchName] = useState("")
  const [msgObj, setMsgObj] = useState({
    message: null,
    color: "green"
  })

  useEffect(
    () => {
      apiService.getPersons()
        .then(data => setPersons(data))
        .catch(err => {
          console.log("getPersons err: ", err)
        })
    },
    []
  )

  const showMsg = (message, color) => {
    setMsgObj({
      message: message,
      color: color
    })

    setTimeout(
      () => setMsgObj({ message: null }),
      5000
    )
  }

  const addName = (event) => {
    setNewName(event.target.value)
  }

  const addNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const inputSearchName = (event) => {
    const v = event.target.value
    setSearchName(v)

    if (v === "") {
      setSearchResults([])
    } else {
      const results = [...persons].filter(person => person.name.toLocaleLowerCase().includes(v.toLocaleLowerCase()))
      setSearchResults(results)
    }
  }

  const clickSubmit = (event) => {
    event.preventDefault()
    if (newName !== "" && newNumber !== "") {

      const existPerson = persons.find(v => v.name === newName)
      if (existPerson) {
        const existStr = `${newName} is already added to phonebook`
        if (existPerson.number === newNumber) {
          alert(existStr)
        } else {
          if (window.confirm(`${existStr}, replace the old number with the new one?`)) {

            const newObj = {
              ...existPerson,
              number: newNumber
            }

            apiService.update(existPerson.id, newObj)
              .then(data => {
                console.log("update number: ", data)
                setPersons(persons.map(v => v.id === data.id ? data : v))
                setSearchResults(searchResults.map(v => v.id === data.id ? data : v))
                setNewName("")
                setNewNumber("")
              })
              .catch(err => {
                console.log("update err: ", err)
              })
          }
        }
      } else {
        const newPerson = {
          name: newName,
          number: newNumber
        }

        apiService.create(newPerson)
          .then(data => {
            console.log("add person success: ", data)
            setPersons(persons.concat(data))

            setNewName("")
            setNewNumber("")

            showMsg(`Added ${data.name}`, "green")
          })
          .catch(err => {
            console.log("add person err: ", err.response.data)
            showMsg(
              err.response.data.error,
              "red"
            )
          })

      }
    }
  }

  const onClickDelete = (person) => {
    if (window.confirm(`Delete ${person.name} ?`)) {
      apiService.deletePerson(person.id)
        .then(data => {
          console.log("deleted from server: ", data)
          setPersons(persons.filter(v => v.id !== person.id))
          setSearchResults(searchResults.filter(v => v.id !== person.id))
        })
        .catch(err => {
          console.log("delete err: ", err)

          if (404 === err.response.status) {
            showMsg(`Information of ${person.name} has already been removed from server`, "red")

            setPersons(persons.filter(v => v.name !== person.name))
            setSearchResults(searchResults.filter(v => v.name !== person.name))
          }
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification msgObj={msgObj} />
      <Filter value={searchName} onChange={inputSearchName} />
      <h3>add a new</h3>
      <PersonForm
        valueName={newName}
        onChangeName={addName}
        valueNumber={newNumber}
        onChangeNumber={addNumber}
        onClickSubmit={clickSubmit}
      />
      <h3>Numbers</h3>
      <Persons persons={(searchName.length > 0 ? searchResults : persons)} onClickDelete={onClickDelete} />
    </div>
  )
}

export default App