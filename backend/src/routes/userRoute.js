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

router.post('/adduser', (req, res) => {
  const req_string = stringifyReq(req)
  const user = new User({name: "name", email: "email", password: "password"})
  
  console.log(req_string)
  console.log(user)
  res.send(req_string)
})

module.exports = router