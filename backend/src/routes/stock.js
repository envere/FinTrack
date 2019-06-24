const StockName = require('../models/StockNameModel')
const StockPrice = require('../models/StockPriceModel')
const alphavantage = require('../util/alphavantage')
const jwt = require('../util/jwt')
const express = require('express')
const router = express.Router()

router.post('/latestprice', (req, res) => {
  jwt
    .verifyJWT(req.token)
    .then(auth => {
      const symbol = req.body.symbol
      StockName
        .findOne({ symbol: symbol })
        .then(stock => {
          if (stock) {
            res.status(200).json({
              message: 'stock name and latest price',
              stock,
            })
          } else {
            alphavantage
              .daily
              .latestprice(symbol)
              .then(latestprice => {
                const stock = new StockName({
                  symbol: symbol,
                  price: latestprice,
                })
                stock.save()
                res.status(200).json({
                  message: 'stock name and latest price',
                  stock,
                })
              })
              .catch(err => res.sendStatus(404))
          }
        })
        .catch(err => res.sendStatus(404))
    })
})

module.exports = router