const User = require('../models/user-model')
const Blacklist = require('../models/blacklist-model')
const bcrypt = require('../util/bcrypt')
const jwt = require('../util/jwt')
const express = require('express')
const router = express.Router()

router.post('/deleteaccount', (req, res) => {
  const _id = req.body._id
  const supplied_password = req.body.password
  User
    .findById(_id)
    .then(user => {
      if (!user) {
        res.sendStatus(404)
      } else {
        bcrypt
          .checkPassword(supplied_password, user.password)
          .then(isValid => {
            if (isValid) {
              User
                .findByIdAndDelete(_id)
                .then(user => {
                  const _id = user._id
                  const username = user.username
                  res.status(200).json({
                    message: `removed ${user.username} from database`,
                    user: {
                      _id,
                      username,
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

router.post('/symbol/add', (req, res) => {
  const _id = req.body._id
  const symbol = req.body.symbol
  const units = req.body.units === "" ? 0 : req.body.units
  const initialvalue = req.body.initialvalue === "" ? 0 : req.body.initialvalue
  User
    .findById(_id)
    .then(user => {
      const _id = user._id
      const username = user.username
      if (!user) {
        res.sendStatus(404)
      } else {
        const newsymbol = { symbol, units, initialvalue }
        const check = user.symbols.filter(elem => elem.symbol === symbol).length === 0
        if (check) {
          User
            .findByIdAndUpdate(_id, { $push: { symbols: newsymbol } })
            .then(user => {
              res.status(200).json({
                message: `added {${symbol}, ${units}, ${initialvalue}} to ${user.username}`,
                user: {
                  _id,
                  username,
                },
              })
            })
            .catch(err => res.sendStatus(500))
        } else {
          res.status(200).json({
            message: `${symbol} is already under ${user.username}'s account`,
            user: {
              _id,
              username,
            },
          })
        }
      }
    })
    .catch(err => res.sendStatus(500))
})

router.post('/symbol/update', (req, res) => {
  const _id = req.body._id
  const symbol = req.body.symbol
  const units = req.body.units === "" ? 0 : req.body.units
  const initialvalue = req.body.initialvalue === "" ? 0 : req.body.initialvalue
  User
    .findById(_id)
    .then(user => {
      const _id = user._id
      const username = user.username
      if (!user) {
        res.sendStatus(404)
      } else {
        const check = user.symbols.filter(elem => elem.symbol === symbol).length !== 0
        if (check) {
          User
            .findById(_id)
            .then(user => {
              const symbols = user.symbols
              symbols.forEach(elem => {
                if (elem.symbol === symbol) {
                  elem.units = units
                  elem.initialvalue = initialvalue
                }
              })
              User
                .findByIdAndUpdate(_id, { symbols: symbols })
                .then(user => {
                  res.status(200).json({
                    message: `updated symbol: ${symbol}, units: ${units}, initialprice: ${initialvalue}`,
                    user: {
                      _id,
                      username,
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

router.post('/logout', (req, res) => {
  const _id = req.body._id
  const accesstoken = req.accesstoken
  const refreshtoken = req.refreshtoken
  const addBlacklist = (userid, token) => {
    const exp = jwt.payload_JWT(token).exp
    const expireAt = new Date(exp * 1000)
    const blacklist = new Blacklist({
      userid,
      token,
      expireAt,
    })
    return blacklist
      .save()
      .catch(err => res.sendStatus(500))
  }
  Promise
    .all([addBlacklist(_id, accesstoken), addBlacklist(_id, refreshtoken)])
    .then(done => res.status(200).json({ message: `logged out` }))
    .catch(err => res.sendStatus(500))
})

router.post('/symbol/delete', (req, res) => {
  const _id = req.body._id
  const symbol = req.body.symbol
  User
    .findByIdAndUpdate(_id, { $pull: { symbols: { symbol } } })
    .then(user => {
      const _id = user._id
      const username = user.username
      if (!user) {
        res.sendStatus(404)
      } else {
        res.status(200).json({
          message: `removed ${symbol} from ${user.username}`,
          user: {
            _id,
            username,
          },
        })
      }
    })
    .catch(err => res.sendStatus(400))
})

module.exports = router
