const StockName = require('../models/StockNameModel')
const StockPrice = require('../models/StockPriceModel')
const alphavantage = require('../util/alphavantage')
const jwt = require('../util/jwt')
const express = require('express')
const router = express.Router()

function getStockName(symbol, res) {
  StockName
    .findOne({ symbol: symbol })
    .then(stock => {
      if (stock) {
        res.status(200).json({
          message: `getting ${symbol} latest price`,
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
            res.status(200).json({
              message: `getting ${symbol} latest price`,
              stock,
            })
            stock.save()
          })
          .catch(err => res.sendStatus(404))
      }
    })
    .catch(err => res.sendStatus(400))
}

function initHistory(symbol) {
  alphavantage
    .monthly
    .prices(symbol)
    .then(prices => {
      const maxYear = prices[0].date.getFullYear()
      const minYear = prices[prices.length - 1].date.getFullYear()

      const years = []
      for (let i = minYear; i <= maxYear; ++i) {
        years.push(i)
      }

      const buckets = new Map()
      years.forEach(year => buckets.set(year, new StockPrice({ symbol, year })))

      prices.forEach(price => {
        const year = price.date.getFullYear()
        const month = price.date.getMonth()
        const value = price.price
        const bucket = buckets.get(year)
        bucket.months.push({ date: month, price: value })
      })
      alphavantage
        .daily
        .prices(symbol)
        .then(prices => {
          prices.forEach(price => {
            const year = price.date.getFullYear()
            const month = price.date.getMonth()
            const date = price.date.getDate()
            const value = price.price
            const bucket = buckets.get(year)
            bucket.days.push({ date: [month, date], price: value })
          })
          return buckets
        })
        .then(buckets => buckets.forEach(stockprice => stockprice.save()))
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
}

initHistory('MSFT')

router.post('/latestprice', (req, res) => {
  jwt
    .verifyJWT(req.token)
    .then(auth => {
      const symbol = req.body.symbol
      getStockName(symbol, res)
    })
})

router.post('/')

module.exports = router