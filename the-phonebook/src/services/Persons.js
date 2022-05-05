import axios from "axios"


const baseUrl = "/api/persons"

const getPersons = () => axios.get(baseUrl)
  .then(response => response.data)

const create = (newObj) => axios.post(baseUrl, newObj)
  .then(response => response.data)

const deletePerson = (id) => axios.delete(`${baseUrl}/${id}`)
  .then(response => response.data)

const update = (id, newObj) => axios.put(`${baseUrl}/${id}`, newObj)
  .then(response => response.data)

const OBJ = {
  getPersons,
  create,
  deletePerson,
  update
}

export default OBJ