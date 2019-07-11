const StockPrice = require('../models/stockprice-model')
const alphavantage = require('../util/alphavantage')
const init = require('../util/init-stocks-dividends')
const express = require('express')
const router = express.Router()

router.get('/intraday/latestprice', (req, res) => {
  const symbol = req.query.symbol
  alphavantage
    .intraday
    .latestprice(symbol)
    .then(latestprice => {
      if (latestprice) {
        res.status(200).json({
          message: `latest price ${latestprice.price} at time ${latestprice.date} (intraday)`,
          latestprice,
        })
      } else {
        res.sendStatus(404)
      }
    })
    .catch(err => res.sendStatus(500))
})

router.post('/daily/price', (req, res) => {
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

router.post('/pricerange', (req, res) => {
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
  const prices = {
    days: [],
    months: [],
  }
  const isEmpty = prices => prices.days.length === 0 && prices.months.length === 0
  if (ISOstart > ISOend) {
    res.sendStatus(400)
  } else {
    StockPrice
      .range(symbol, ISOstart, ISOend)
      .then(buckets => {
        if (buckets.length === 0) {
          const alphaDaily = alphavantage
            .daily
            .prices_range(symbol, ISOstart, ISOend)
            .then(dailypricerange => {
              prices.days = dailypricerange.filter(price => {
                const ISOdate = formatToISO(price.date)
                return ISOstart <= ISOdate && ISOdate <= ISOend
              })
            })
            .catch(err => res.sendStatus(500))
          const alphaMonthly = alphavantage
            .monthly
            .prices_range(symbol, ISOstartmonth, ISOendmonth)
            .then(monthlypricerange => {
              prices.months = monthlypricerange.filter(price => {
                const ISOdate = formatToMonthISO(formatToISO(price.date))
                return (ISOstartmonth <= ISOdate && ISOdate <= ISOendmonth)
              })
            })
            .catch(err => res.sendStatus(500))
          Promise
            .all([alphaDaily, alphaMonthly])
            .then(done => isEmpty(prices))
            .then(isEmpty => {
              if (isEmpty) {
                res.sendStatus(404)
              } else {
                res.status(200).json({
                  message: `${symbol} prices from ${ISOstart} to ${ISOend}`,
                  prices,
                })
              }
            })
            .catch(err => res.sendStatus(500))
          init(symbol)
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
          if (isEmpty(prices)) {
            res.sendStatus(404)
          } else {
            res.status(200).json({
              message: `${symbol} prices from ${ISOstart} to ${ISOend}`,
              prices,
            })
          }
        }
      })
      .catch(err => res.sendStatus(500))
  }
})

module.exports = router