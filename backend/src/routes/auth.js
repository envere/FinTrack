const express = require('express')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const router = express.Router()

router.post('/login', (req, res, next) => {

  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        url: req.url,
        message: 'error',
        user: user,
        error: info ? info.message : 'login failed',
      })
    }
    req.login(user, { session: false }, err => {
      if (err) {
        res.json({
          url: req.url,
          message: 'error',
          error: err,
        })
      }

      const token = jwt.sign(user, 'secret_jwt')
      res.json({user, token})
    })
  })(req, res)
})