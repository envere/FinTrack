const User = require("../models/user-model")
const Transaction = require('../models/transaction-model')
const Portfolio = require('../models/portfolio-model')
const express = require("express")
const bcrypt = require("../util/bcrypt")
const jwt = require('../util/jwt')
const jwtConfig = require('../configs/jwt-config')
const router = express.Router()

router.post("/register", (req, res) => {
  const username = req.body.username
  const email = req.body.email
  const plaintext_password = req.body.password

  bcrypt
    .hash(plaintext_password)
    .then(hash => {
      const password = hash
      const user = new User({
        username,
        email,
        password,
      })
      return user.save()
    })
    .then(user => {
      const _id = user._id
      const username = user.username
      const addTransaction = userid => {
        const transaction = new Transaction({ userid })
        return transaction.save()
      }
      const addPortfolio = userid => {
        const portfolio = new Portfolio({ userid })
        return portfolio.save()
      }
      Promise
        .all([addTransaction(_id), addPortfolio(_id)])
        .then(done => {
          res.status(201).json({
            message: `added ${username}`,
            user: { _id, username }
          })
        })
        .catch(err => res.sendStatus(500))
    })
    .catch(err => res.sendStatus(500))
})

router.post("/login", (req, res) => {
  const supplied_username = req.body.username.toLowerCase()
  const supplied_password = req.body.password
  User
    .findOne({ username: supplied_username })
    .then(user => {
      if (!user) {
        res.sendStatus(404)
      } else {
        bcrypt
          .checkPassword(supplied_password, user.password)
          .then(isValid => {
            if (isValid) {
              const _id = user._id
              const username = user.username
              const accessPromise = jwt.sign_access_JWT({ _id }, { expiresIn: jwtConfig.access_duration })
              const refreshPromise = jwt.sign_refresh_JWT({ _id }, { expiresIn: jwtConfig.refresh_duration })
              Promise
                .all([accessPromise, refreshPromise])
                .then(tokens => {
                  const accesstoken = tokens[0]
                  const refreshtoken = tokens[1]
                  res.status(200).json({
                    message: `authorization passed`,
                    accesstoken,
                    refreshtoken,
                    user: {
                      _id,
                      username,
                    }
                  })
                })
                .catch(err => res.sendStatus(500))
            } else {
              res.sendStatus(403)
            }
          })
          .catch(err => res.sendStatus(500))
      }
    })
    .catch(err => res.sendStatus(500))
})

router.post('/refresh', jwt.authenticate_refresh_JWT(), (req, res) => {
  const _id = req.body._id
  const accessPromise = jwt.sign_access_JWT({ _id }, { expiresIn: jwtConfig.access_duration })
  const refreshPromise = jwt.sign_refresh_JWT({ _id }, { expiresIn: jwtConfig.refresh_duration })
  Promise
    .all([accessPromise, refreshPromise])
    .then(tokens => {
      const accesstoken = tokens[0]
      const refreshtoken = tokens[1]
      res.status(200).json({
        accesstoken,
        refreshtoken,
      })
    })
    .catch(err => res.sendStatus(500))
})

module.exports = router