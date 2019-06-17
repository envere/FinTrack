const User = require('../models/UserModel')
const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()

router.get('/', (req, res) => {
  User
    .find()
    .then(doc => {
      res.status(200).json({
        request: `${req.url}`,
        message: 'list of all users',
        users: doc,
      })
    })
    .catch(err => {
      res.status(500).json({
        request: `${req.url}`,
        message: 'error',
        error: err,
      })
    })
})

router.get('/:username', (req, res) => {
  User
    .findOne({username: req.params.username})
    .then(doc => {
      res.status(200).json({
        request: `${req.url}`,
        message: `getting user by username: ${req.params.username}`,
        user: doc,
      })
    })
    .catch(err => {
      res.status(500).json({
        request: `${req.url}`,
        message: 'error',
        error: err,
      })
    })
})

router.post('/register', (req, res) => {

  const username = req.body.username
  const email = req.body.email
  const password = req.body.password

  const user = User.createUser(username, email, password)

  user
    .save()
    .then(doc => {
      res.status(200).json({
        request: `${req.url}`,
        message: 'added user',
        user: doc,
      })
    })
    .catch(err => {
      res.status(500).json({
        request: `${req.url}`,
        message: 'error',
        error: err,
      })
    })  
})

module.exports = router