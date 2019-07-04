const User = require('../models/UserModel')
const bcrypt = require('../util/bcrypt')
const jwt = require('../util/jwt')
const express = require('express')
const router = express.Router()

router.post('/deleteaccount', (req, res) => {
  jwt
    .verifyJWT(req.token)
    .then(auth => {
      const id = req.body.id
      const supplied_password = req.body.password
      User
        .findById(id)
        .then(user => {
          if (!user) {
            res.sendStatus(404)
          } else {
            bcrypt
              .checkPassword(supplied_password, user.password)
              .then(isValid => {
                if (isValid) {
                  User
                    .findByIdAndDelete(id)
                    .then(user => {
                      res.status(200).json({
                        message: `removed ${user.username} from database`,
                        user: {
                          _id: user._id,
                          username: user.username,
                        },
                      })
                    })
                } else {
                  res.sendStatus(403)
                }
              })
              .catch(err => res.sendStatus(500))
          }
        })
        .catch(err => res.sendStatus(500))
    })
    .catch(err => res.sendStatus(403))
})

router.post('/symbol/add', (req, res) => {
  jwt
    .verifyJWT(req.token)
    .then(auth => {
      const id = req.body.id
      const symbol = req.body.symbol
      const units = req.body.units === "" ? 0 : req.body.units
      const initialvalue = req.body.initialvalue === "" ? 0 : req.body.initialvalue
      User
        .findById(id)
        .then(user => {
          if (!user) {
            res.sendStatus(404)
          } else {
            const newsymbol = { symbol, units, initialvalue }
            const check = user.symbols.filter(elem => elem.symbol === symbol).length === 0
            if (check) {
              User
                .findByIdAndUpdate(id, { $push: { symbols: newsymbol } })
                .then(user => {
                  res.status(200).json({
                    message: `added {${symbol}, ${units}, ${initialvalue}} to ${user.username}`,
                    user: {
                      _id: user._id,
                      username: user.username,
                    },
                  })
                })
                .catch(err => res.sendStatus(500))
            } else {
              res.status(200).json({
                message: `${symbol} is already under ${user.username}'s account`,
                user: {
                  _id: user._id,
                  username: user.username,
                },
              })
            }
          }
        })
        .catch(err => res.sendStatus(500))
    })
    .catch(err => res.sendStatus(403))
})

router.post('/symbol/update', (req, res) => {
  jwt
    .verifyJWT(req.token)
    .then(auth => {
      const id = req.body.id
      const symbol = req.body.symbol
      const units = req.body.units === "" ? 0 : req.body.units
      const initialvalue = req.body.initialvalue === "" ? 0 : req.body.initialvalue
      User
        .findById(id)
        .then(user => {
          if (!user) {
            res.sendStatus(404)
          } else {
            const check = user.symbols.filter(elem => elem.symbol === symbol).length !== 0
            if (check) {
              User
                .findById(id)
                .then(user => {
                  const symbols = user.symbols
                  symbols.forEach(elem => {
                    if (elem.symbol === symbol) {
                      elem.units = units
                      elem.initialvalue = initialvalue
                    }
                  })
                  User
                    .findByIdAndUpdate(id, { symbols: symbols })
                    .then(user => {
                      res.status(200).json({
                        message: `updated symbol: ${symbol}, units: ${units}, initialprice: ${initialvalue}`,
                        user: {
                          _id: user._id,
                          username: user.username,
                        },
                      })
                    })
                    .catch(err => res.sendStatus(400))

                })
            } else {
              res.status(200).json({
                message: `${symbol} not saved under ${user.username}'s account`,
                user: {
                  _id: user._id,
                  username: user.username,
                },
              })
            }
          }
        })
        .catch(err => res.sendStatus(400))
    })
    .catch(err => res.sendStatus(403))
})

router.post('/symbol/delete', (req, res) => {
  jwt
    .verifyJWT(req.token)
    .then(auth => {
      const id = req.body.id
      const symbol = req.body.symbol
      User
        .findByIdAndUpdate(id, { $pull: { symbols: { symbol } } })
        .then(user => {
          if (!user) {
            res.sendStatus(404)
          } else {
            res.status(200).json({
              message: `removed ${symbol} from ${user.username}`,
              user: {
                _id: user._id,
                username: user.username,
              },
            })
          }
        })
        .catch(err => res.sendStatus(400))
    })
    .catch(err => res.sendStatus(403))
})

module.exports = router
