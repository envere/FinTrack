const User = require('../models/UserModel')
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = express.Router()

const token = require('../configs/token')
const secret = token.secret

router.get('/getUsers', token.queryJWT, (req, res) => {
  token.verifyJWT(req.token, secret)
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
  // jwt.verify(req.token, secret, (err, auth) => {
  //   if (err) {
  //     res.sendStatus(403)
  //   }

  //   User
  //   .find()
  //   .then(doc => {
  //     res.status(200).json({
  //       request: `${req.url}`,
  //       message: 'list of all users',
  //       users: doc,
  //     })
  //   })
  //   .catch(err => {
  //     res.status(500).json({
  //       request: `${req.url}`,
  //       message: 'error',
  //       error: err,
  //     })
  //   })
  // })
})

router.get('/getUser/:username', (req, res) => {
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

  const saltRounds = 12

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
            token
              .signJWT({user}, secret)
              .then(token => res.json({token}))
              .catch(err => res.status(500).json({
                request: req.url,
                message: 'error',
                error: err,
              }))
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

module.exports = router
