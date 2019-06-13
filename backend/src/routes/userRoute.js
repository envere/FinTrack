const User = require('../models/userModel')
const express = require('express')
const router = express.Router()

const stringifyReq = req => {
  const params = JSON.stringify(req.params, null, 2)
  const body = JSON.stringify(req.body, null, 2)
  const url = JSON.stringify(req.url, null, 2)
  const query = JSON.stringify(req.query, null, 2)
  const headers = JSON.stringify(req.headers, null, 2)
  return `req: \n\nparams: ${params}\n\nbody: ${body}\n\nurl: ${url}\n\nquery: ${query}\n\nheaders: ${headers}\n`
}

// POST
// localhost:3000/user/{user's name}/{user's email}
router.post('/adduser/:name/:email', (req, res) => {
  const user = new User({
    name: req.params.name,
    email: req.params.email,
    password: 'test_password',
  })
  user
    .save()
    .then(doc => {
      console.log(doc)
      res.send(doc)
    })
    .catch(err => {
      console.log(err)
      res.send(err)
    })
})

// GET
// localhost:3000/user?email={user email}
router.get('/getuser', (req, res) => {
  
})

module.exports = router