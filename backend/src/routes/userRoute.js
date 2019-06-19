const User = require('../models/UserModel')
const express = require('express')
const router = express.Router()

const jwt = require('../util/jwt')

router.get('/getUsers', jwt.queryJWT, (req, res) => {
  jwt.verifyJWT(req.token)
    .then(auth => {
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
    .catch(err => res.sendStatus(403))
})

router.get('/getUser/:username', (req, res) => {
  User
    .findOne({ username: req.params.username })
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

module.exports = router
