const User = require('../models/userModel')
const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  User
    .find()
    .then(doc => {
      console.log(doc)
      res.status(200).json(doc)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json(err)
    })
})

router.post('/', (req, res) => {
  console.log(req.body)
  res.send(JSON.stringify(req, false, 2))
})

module.exports = router