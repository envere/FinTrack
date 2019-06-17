const User = require('../models/UserModel')
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
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
  const plaintext_password = req.body.password

  const saltRounds = 10

  bcrypt.hash(plaintext_password, saltRounds, (err, hash) => {
    if (err) {
      res.json({
        request: req.url,
        message: 'error',
        error: err,
      })
    }
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
  const supplied_username = 'test_username'
  const supplied_password = 'test_password'


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
      bcrypt.compare(supplied_password, user.password, (err, result) => {
        if (!result) {
          res.status(400).json({
            request: req.url,
            message: 'error',
            error: 'invalid password',
          })
        }
        
      })
    .catch(err => {
      res.status(500).json({
        request: req.url,
        message: 'error',
        error: err,
      })
    })

  // User
  //   .findByUsername('x')
  //   .then(doc => {
  //     if (!doc) {
  //       throw new Error(`user with username: ${supplied_username} does not exist`)
  //     }
  //     return doc
  //   })
  //   .then(doc => doc.verifyPassword(supplied_password))
})

module.exports = router
