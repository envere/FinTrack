const User = require('../models/UserModel')
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = express.Router()

const secret = require('../configs/jwtConfig').secret

router.get('/getUsers', verifyJWT, (req, res) => {
  jwt.verify(req.token, secret, (err, auth) => {
    if (err) {
      res.sendStatus(403)
    }

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
  const plaintext_password = req.body.password

  const saltRounds = 10

  bcrypt.hash(plaintext_password, saltRounds, (err, hash) => {
    const user = new User({
      username: username,
      email: email,
      password: hash,
    })
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
})

router.post('/login', (req, res) => {
  const supplied_username = req.body.username
  const supplied_password = req.body.password

  User
    .findOne({username: supplied_username})
    .then(user => {
      if (!user) {
        res.status(404).json({
          request: req.url,
          message: 'error',
          error: 'user account does not exist'
        })
      }
      bcrypt
        .compare(supplied_password, user.password)
        .then(isValid => {
          if (isValid) {
            jwt.sign({user}, secret, (err, token) => {
              if (err) {
                res.status(500).json({
                  request: req.url,
                  message: 'error',
                  error: err,
                })
              } else {
                res.json({token})
              }
            })
          } else {
            res.status(400).json({
              request: req.url,
              message: 'error',
              error: 'invalid password',
            })
          }
        })
    })
})

// checks if jwt token is valid
function verifyJWT(req, res, next) {
  const bearerHeader = req.headers['authorization']
  if (bearerHeader) {
    bearerToken = bearerHeader.split(' ')[1]
    req.token = bearerToken
    next()
  } else {
    res.sendStatus(403)
  }
}

module.exports = router
