const express = require('express')
const path = require('path')
const crypto = require('crypto')
const session = require('express-session')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
// TODO: Change to fetch from Salesforce
const formData = require('./formData')
const port = process.env.PORT || 5000
const salt = process.env.PASSWORD_SALT
const saltedPassword = process.env.PASSWORD_HASH
const notValidatedRes = JSON.stringify({loginSuccess: false})
const validatedRes = JSON.stringify({loginSuccess: true})

const app = express()
app.use(cookieParser())
const MemoryStore = session.MemoryStore
app.use(session({
  secret: 'secret',
  cookie: {maxAge: 6000, secure: false},
  resave: true,
  saveUninitialized: true,
  store: new MemoryStore(),
}))
app.use(bodyParser.json())

function checkPassword(password, digest, salt) {
  const hash = crypto.createHmac('sha512', salt)
  hash.update(password)
  return hash.digest('hex') === digest
}

app.post('/api/login', (req, res) => {
  const body = req.body
  const { username, password } = body
  if (!password) {
    res.status(401)
    res.send(notValidatedRes)
  }
  if (checkPassword(password, saltedPassword, salt)) {
    req.session.validated = true
    req.session.save(function () {
      res.status(200)
      res.send(validatedRes)
    })
  }
  else {
    res.status(401)
    res.send(notValidatedRes)
  }
})

app.get('/api/getForm', (req, res) => {
  if (!req.session.validated) {
    res.status(401)
    res.send(notValidatedRes)
  }
  else {
    res.status(200)
    res.send(JSON.stringify(formData))
  }
})

app.listen(port, () => console.log('Server running on port', port))
