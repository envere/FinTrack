const StockName = require('../models/StockNameModel')
const StockPrice = require('../models/StockPriceModel')
const DividendName = require('../models/DividendNameModel')
const DividendPrice = require('../models/DividendPriceModel')
const alphavantage = require('../util/alphavantage')
const jwt = require('../util/jwt')
const init = require('../util/initDB')
const express = require('express')
const router = express.Router()

router.post('/daily/dividend', (req, res) => {
  jwt
    .verifyJWT(req.token)
    .then(auth => {
      const symbol = req.body.symbol
      const ISOdate = req.body.date
      const year = ISOdate.split('-')[0]
      DividendPrice
        .findOne({ symbol, year })
        .then(dividendprice => {
          if (dividendprice) {
            const filtered = dividendprice.days.filter(day => day.date.toISOString().split('T')[0] === ISOdate)
            if (filtered.length === 0) {
              res.sendStatus(404)
            } else {
              const dividend = filtered[0]
              res.status(200).json({
                message: `getting ${symbol} dividend on ${ISOdate}`,
                dividend,
              })
            }
          } else {
            alphavantage
              .dailyAdjusted
              .dividends(symbol)
              .then(dividends => {
                const filtered = dividends.filter(dividend => dividend.date.toISOString().split('T')[0] === ISOdate)
                if (filtered.length === 0) {
                  res.sendStatus(404)
                } else {
                  const dividend = filtered[0]
                  res.status(200).json({
                    message: `getting ${symbol} dividend on ${ISOdate}`,
                    dividend,
                  })
                  init(symbol)
                }
              })
              .catch(err => res.sendStatus(500))
          }
        })
        .catch(err => res.sendStatus(500))
    })
    .catch(err => res.sendStatus(403))
})

router.post('/dividendrange', (req, res) => {
  jwt
    .verifyJWT(req.token)
    .then(auth => {
      const symbol = req.body.symbol
      const start = new Date(req.body.start)
      const end = new Date(req.body.end)
      const startyear = start.getFullYear()
      const endyear = end.getFullYear()
    })
    .catch(err => res.sendStatus(403))
})