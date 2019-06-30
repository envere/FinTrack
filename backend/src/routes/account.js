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
      if (!(id && supplied_password)) {
        res.sendStatus(400)
      } else {
        User
          .findById(id)
          .then(user => {
            if (!user) {
              res.sendStatus(404)
            } else {
              bcrypt
                .checkPassword(supplied_password, user.password)
                .then(isValid => {
                  console.log(isValid)
                  if (isValid) {
                    User
                      .findByIdAndDelete(id)
                      .then(user => {
                        res.status(200).json({
                          message: `removed ${user.username} from database`,
                          user,
                        })
                      })
                  } else {
                    res.sendStatus(403)
                  }
                })
                .catch(err => res.sendStatus(400))
            }
          })
          .catch(err => res.sendStatus(400))
      }
    })
    .catch(err => res.sendStatus(403))
})

router.post('/addsymbol', (req, res) => {
  jwt
    .verifyJWT(req.token)
    .then(auth => {
      const id = req.body.id
      const symbol = req.body.symbol
      const units = req.body.units === "" ? 0 : req.body.units
      const initialprice = req.body.initialprice === "" ? 0 : req.body.initialprice
      if (!(id && symbol)) {
        res.sendStatus(400)
      } else {
        User
          .findById(id)
          .then(user => {
            if (!user) {
              res.sendStatus(404)
            } else {
              const value = { symbol, units, initialprice }
              const check = user.symbols.filter(elem => elem.symbol === symbol).length === 0
              if (check) {
                User
                  .findByIdAndUpdate(id, { $push: { symbols: value } })
                  .then(user => {
                    res.status(200).json({
                      message: `added {${symbol}, ${units}, ${initialprice}} to ${user.username}`,
                      user,
                    })
                  })
                  .catch(err => res.sendStatus(400))
              } else {
                res.status(200).json({
                  message: `${symbol} is already under ${user.username}'s account`,
                  user,
                })
              }
            }
          })
          .catch(err => res.sendStatus(400))
      }
    })
    .catch(err => res.sendStatus(403))
})

router.post('/updatesymbol', (req, res) => {
  jwt
    .verifyJWT(req.token)
    .then(auth => {
      const id = req.body.id
      const symbol = req.body.symbol
      const units = req.body.units === "" ? 0 : req.body.units
      const initialprice = req.body.initialprice === "" ? 0 : req.body.initialprice
      if (!(id && symbol)) {
        res.sendStatus(400)
      } else {
        User
          .findById(id)
          .then(user => {
            if (!user) {
              res.sendStatus(404)
            } else {
              const symbols = user.symbols
              const check = symbols.filter(elem => elem.symbol === symbol).length !== 0
              if (check) {
                User
                  .findById(id)
                  .then(user => {
                    const symbols = user.symbols
                    symbols.forEach(elem => {
                      if (elem.symbol === symbol) {
                        elem.units = units
                        elem.initialprice = initialprice
                      }
                    })
                    User
                      .findByIdAndUpdate(id, { symbols: symbols })
                      .then(user => {

                        res.status(200).json({
                          message: `updated symbol: ${symbol}, units: ${units}, initialprice: ${initialprice}`,
                          user,
                        })
                      })
                      .catch(err => res.sendStatus(400))

                  })
              } else {
                res.status(200).json({
                  message: `${symbol} not saved under ${user.username}'s account`,
                  user,
                })
              }
            }
          })
          .catch(err => res.sendStatus(400))
      }
    })
    .catch(err => res.sendStatus(403))
})

router.post('/deletesymbol', (req, res) => {
  jwt
    .verifyJWT(req.token)
    .then(auth => {
      const id = req.body.id
      const symbol = req.body.symbol
      User
        .findByIdAndUpdate(id, { $pull: { symbols: { symbol } } })
        .then(user => {
          res.status(200).json({
            message: `removed ${symbol} from ${user.username}`,
            user,
          })
        })
        .catch(err => res.sendStatus(400))
    })
})

module.exports = router
