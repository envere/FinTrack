const StockName = require('../models/StockNameModel')
const StockPrice = require('../models/StockPriceModel')
const alphavantage = require('../util/alphavantage')
const jwt = require('../util/jwt')
const express = require('express')
const router = express.Router()

function initPriceHistory(symbol) {
  StockPrice
    .deleteMany({ symbol })
    .then(done => {
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
            bucket.months.push({ date: price.date, price: value })
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
                bucket.days.push({ date: price.date, price: value })
              })
              return buckets
            })
            .then(buckets => buckets.forEach(stockprice => stockprice.save()))
            .then(done => console.log(`initialized ${symbol} stock prices`))
            .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
}

router.post('/intraday/latestprice', (req, res) => {
  jwt
    .verifyJWT(req.token)
    .then(auth => {
      const symbol = req.body.symbol
      if (!symbol) {
        res.sendStatus(400)
      } else {
        alphavantage
          .intraday
          .latestprice(symbol)
          .then(latestprice => {
            res.status(200).json({
              message: `latest price ${latestprice.price} at time ${latestprice.date} (intraday)`,
              latestprice,
            })
          })
          .catch(err => res.sendStatus(400))
      }
    })
    .catch(err => res.sendStatus(403))
})

router.post('/daily/latestprice', (req, res) => {
  jwt
    .verifyJWT(req.token)
    .then(auth => {
      const symbol = req.body.symbol
      if (!symbol) {
        res.sendStatus(400)
      } else {
        StockName
          .findOne({ symbol: symbol })
          .then(stock => {
            if (stock) {
              res.status(200).json({
                message: `getting ${symbol} latest price (daily)`,
                stock,
              })
            } else {
              alphavantage
                .daily
                .latestprice(symbol)
                .then(latestprice => {
                  const price = latestprice.price
                  const stock = new StockName({
                    price,
                    stock,
                  })
                  res.status(200).json({
                    message: `getting ${symbol} latest price (daily)`,
                    stock,
                  })
                  stock.save()
                  initPriceHistory(symbol)
                })
                .catch(err => res.sendStatus(404))
            }
          })
          .catch(err => res.sendStatus(400))
      }
    })
    .catch(err => res.sendStatus(403))
})

router.post('/pricerange', (req, res) => {
  jwt
    .verifyJWT(req.token)
    .then(auth => {
      const symbol = req.body.symbol
      const start = req.body.start
      const end = req.body.end
      if (!(symbol && start && end)) {
        res.sendStatus(400)
      } else {
        StockPrice
          .range(symbol, start, end)
          .then(buckets => {
            const data = {
              days: [],
              months: [],
            }
            buckets.forEach(bucket => {
              const format = date => new Date(date.toISOString().split('T')[0])
              const days = bucket.days
              const months = bucket.months
              days.forEach(day => {
                if (start <= format(day.date) && format(day.date) <= end) {
                  data.days.push(day)
                }
              })
              months.forEach(month => {
                if (start <= format(month.date) && format(month.date) <= end) {
                  data.months.push(month)
                }
              })
            })
            return data
          })
          .then(data => {
            if (data.days === [] && data.months === []) {
              alphavantage
                .daily
                .prices_range(symbol, start, end)
                .then(prices => {
                  prices.forEach(price => data.days.push(price))
                  return alphavantage
                    .monthly
                    .prices_range(symbol, start, end)
                })
                .then(prices => {
                  prices.forEach(price => data.months.push(price))
                  res.status(200).json({
                    message: `${symbol} price range from ${start} to ${end}`,
                    stock: data,
                  })
                })
                .then(done => initPriceHistory(symbol))
                .catch(err => res.sendStatus(400))
            } else {
              res.status(200).json({
                message: `${symbol} price range from ${start} to ${end}`,
                stock: data,
              })
            }
          })
          .catch(err => res.sendStatus(400))
      }
    })
})

module.exports = router