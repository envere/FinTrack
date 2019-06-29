const User = require('../models/UserModel')
const jwt = require('../util/jwt')
const express = require('express')
const router = express.Router()

router.post("/addsymbol", (req, res) => {
  jwt
    .verifyJWT(req.token)
    .then(auth => {
      const id = req.body.id
      const symbol = req.body.symbol
      User
        .findById(id)
        .then(user => {
          if (!user) {
            throw new Error
          }
          return user
        })
        .then(user => {
          const symbols = user.symbols
          const check = symbols.reduce((prev, next) => !(next === symbol) && prev, true)
          if (!check) {
            res.status(200).json({
              message: `${symbol} is already in ${user}'s account`,
              user,
              symbol,
            })
          } else {
            symbols.push(symbol)
            User
              .findByIdAndUpdate(id, { symbols })
              .then(user => {
                res.status(200).json({
                  message: `add symbol to ${user}'s account`,
                  user,
                  symbol,
                })
              })
              .catch(err => res.sendStatus(400))
          }
        })
        .catch(err => res.sendStatus(404))
    })
    .catch(err => res.sendStatus(403))
})

router.post("/removesymbol", (req, res) => {
  jwt
    .verifyJWT(req.token)
    .then(auth => {
      const id = req.body.id
      const symbol = req.body.symbol
      User
        .findById(id)
        .then(user => {
          if (!user) {
            throw new Error
          }
          return user
        })
        .then(user => {
          const symbols = user.symbols
          const prevLength = symbols.length
          const updated = symbols.filter(x => x !== symbol)
          const newLength = updated.length
          if (newLength === prevLength) {
            res.status(200).json({
              message: `${stock} is not added under ${user}'s account`,
              user,
              symbol,
            })
          } else {
            User
              .findByIdAndUpdate(id, {symbols: updated})
              .then(user => {
                res.status(200).json({
                  message: `removed ${symbol} from ${user}'s account`,
                  user,
                  symbol,
                })
              })
              .catch(err => res.sendStatus(400))
          }
        })
        .catch(err => res.sendStatus(404))
    })
    .catch(err => res.sendStatus(403))
})