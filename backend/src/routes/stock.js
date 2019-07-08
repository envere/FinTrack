const StockName = require('../models/StockNameModel')
const StockPrice = require('../models/StockPriceModel')
const DividendName = require('../models/DividendNameModel')
const DividendPrice = require('../models/DividendPriceModel')
const alphavantage = require('../util/alphavantage')
const jwt = require('../util/jwt')
const init = require('../util/initDB')
const express = require('express')
const router = express.Router()

router.get('/intraday/latestprice', (req, res) => {
  jwt
    .verifyJWT(req.token)
    .then(auth => {
      const symbol = req.query.symbol
      alphavantage
        .intraday
        .latestprice(symbol)
        .then(latestprice => {
          res.status(200).json({
            message: `latest price ${latestprice.price} at time ${latestprice.date} (intraday)`,
            latestprice,
          })
        })
        .catch(err => res.sendStatus(500))
    })
    .catch(err => res.sendStatus(403))
})

router.post('/daily/price', (req, res) => {
  jwt
    .verifyJWT(req.token)
    .then(auth => {
      const symbol = req.body.symbol
      const ISOdate = req.body.date
      const year = ISOdate.split('-')[0]
      StockPrice
        .findOne({ symbol, year })
        .then(stockprice => {
          if (stockprice) {
            const filtered = stockprice.days.filter(day => day.date.toISOString().split('T')[0] === ISOdate)
            if (filtered.length === 0) {
              res.sendStatus(404)
            } else {
              const price = filtered[0]
              res.status(200).json({
                message: `getting ${symbol} price on ${ISOdate}`,
                price,
              })
            }
          } else {
            alphavantage
              .daily
              .prices(symbol)
              .then(prices => {
                const filtered = prices.filter(price => price.date.toISOString().split('T')[0] === ISOdate)
                if (filtered.length === 0) {
                  res.sendStatus(404)
                } else {
                  const price = filtered[0]
                  res.status(200).json({
                    message: `getting ${symbol} price on ${ISOdate}`,
                    price,
                  })
                }
                init(symbol)
              })
              .catch(err => res.sendStatus(500))
          }
        })
        .catch(err => res.sendStatus(500))
    })
    .catch(err => res.sendStatus(403))
})

router.post('/pricerange', (req, res) => {
  jwt
    .verifyJWT(req.token)
    .then(auth => {
      const formatToISO = date => date.toISOString().split('T')[0]
      const formatToMonthISO = ISOdate => {
        const array = ISOdate.split('-')
        array.pop()
        return array.join('-')
      }
      const symbol = req.body.symbol
      const ISOstart = req.body.start
      const ISOend = req.body.end
      const ISOstartmonth = formatToMonthISO(ISOstart)
      const ISOendmonth = formatToMonthISO(ISOend)
      StockPrice
        .range(symbol, ISOstart, ISOend)
        .then(buckets => {
          const prices = {
            days: [],
            months: [],
          }
          if (buckets.length === 0) {
            alphavantage
              .daily
              .prices_range(symbol, ISOstart, ISOend)
              .then(dailypricerange => {
                console.log(dailypricerange)
                prices.days = dailypricerange.filter(price => {
                  const ISOdate = formatToISO(price.date)
                  return ISOstart <= ISOdate && ISOdate <= ISOend
                })
                alphavantage
                  .monthly
                  .prices_range(symbol, ISOstartmonth, ISOendmonth)
                  .then(monthlypricerange => {
                    console.log(monthlypricerange)
                    prices.months = monthlypricerange.filter(price => {
                      const ISOdate = formatToMonthISO(formatToISO(price.date))
                      return (ISOstartmonth <= ISOdate && ISOdate <= ISOendmonth)
                    })
                  })
                  .then(done => {
                    res.status(200).json({
                      message: `${symbol} prices from ${ISOstart} to ${ISOend}`,
                      prices,
                    })
                    init(symbol)
                  })
                  .catch(err => res.sendStatus(500))
              })
              .catch(err => res.sendStatus(500))
          } else {
            buckets.forEach(bucket => {
              const days = bucket.days
              const months = bucket.months
              days.forEach(day => {
                const ISOdate = formatToISO(day.date)
                if (ISOstart <= ISOdate && ISOdate <= ISOend) {
                  prices.days.push(day)
                }
              })
              months.forEach(month => {
                const ISOdate = formatToMonthISO(formatToISO(month.date))
                if (ISOstartmonth <= ISOdate && ISOdate <= ISOendmonth) {
                  prices.months.push(month)
                }
              })
            })
            res.status(200).json({
              message: `${symbol} prices from ${ISOstart} to ${ISOend}`,
              prices,
            })
          }
        })
        .catch(err => res.sendStatus(500))
    })
    .catch(err => res.sendStatus(403))
})

module.exports = router