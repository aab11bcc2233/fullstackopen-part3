require('dotenv').config()
const morgan = require('morgan')
const express = require('express')
const Contact = require('./models/contact')

const app = express()

app.use(express.static('build'))
app.use(express.json())
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.method(req, res) === 'POST' ? JSON.stringify(req.body) : ''
  ].join(' ')
}))


app.get('/api/persons', (req, res, next) => {
  Contact.find({})
    .then(contacts => {
      if (contacts) {
        res.json(contacts)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.get('/info', (req, res, next) => {

  Contact.find({})
    .then(contacts => {
      if (contacts) {
        res.setHeader('Content-Type', 'text/html;charset="utf-8"')
        res.end(
          `<div>Phonebook has info for ${contacts.length} people</div>
                <div>${new Date()}</div>
                `
        )
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))

})

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Contact.findById(id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id

  Contact.findByIdAndDelete({ _id: id })
    .then(contact => {
      console.log('deleted:', contact)
      if (contact) {
        res.status(204).end()
      } else {
        res.status(404).end
      }
    })
    .catch(error => next(error))
})


app.post('/api/persons', (req, res, next) => {
  const rBody = req.body

  if (!rBody.name || !rBody.number) {
    return res.status(400).json(
      {
        error: 'content missing'
      }
    )
  }

  if (!(rBody.number.match(/^\d{8,}$/g)
        || rBody.number.match(/^\d{2,3}-\d{5,}$/g))) {
    return res.status(400).json(
      {
        error: 'invalidate number'
      }
    )
  }

  Contact.find({})
    .then(persons => {

      if (persons.some(v => v.name.toUpperCase() == rBody.name.toUpperCase())) {
        res.status(400).json(
          {
            error: 'name must be unique'
          }
        )
      } else {
        new Contact(rBody).save()
          .then(person => {
            if (person) {
              res.json(person)
            } else {
              res.status(404).end
            }
          })
          .catch(err => next(err))
      }
    })
    .catch(err => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  const rBody = req.body

  if (!rBody.name || !rBody.number) {
    return res.status(400).json(
      {
        error: 'content missing'
      }
    )
  }


  const options = {
    new: true,
    runValidators: true
  }

  Contact.findByIdAndUpdate({ _id: id, name: rBody.name }, { number: rBody.number }, options)
    .then(person => {
      console.log('updated:', person)
      if (person) {
        res.json(person)
      } else {
        res.status(404).end
      }
    })
    .catch(err => next(err))

})

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})