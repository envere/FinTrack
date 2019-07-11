const DividendPrice = require('../models/dividend-price-model')
const alphavantage = require('../util/alphavantage')
const init = require('../util/init-stocks-dividends')
const express = require('express')
const router = express.Router()

router.post('/daily/dividend', (req, res) => {
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

router.post('/dividendrange', (req, res) => {
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
  const dividends = {
    days: [],
    months: [],
  }
  const isEmpty = dividends => dividends.days.length === 0 && dividends.months.length === 0
  if (ISOstart > ISOend) {
    res.sendStatus(400)
  } else {
    DividendPrice
      .range(symbol, ISOstart, ISOend)
      .then(buckets => {
        if (buckets.length === 0) {
          const alphaDailyAdjusted = alphavantage
            .dailyAdjusted
            .dividends_range(symbol, ISOstart, ISOend)
            .then(dailydividendrange => {
              dividends.days = dailydividendrange.filter(dividend => {
                const ISOdate = formatToISO(dividend.date)
                return ISOstart <= ISOdate && ISOdate <= ISOend
              })
            })
            .catch(err => res.sendStatus(500))
          const alphaMonthlyAdjusted = alphavantage
            .monthlyAdjusted
            .dividends_range(symbol, ISOstartmonth, ISOendmonth)
            .then(monthlydividendrange => {
              dividends.months = monthlydividendrange.filter(dividend => {
                const ISOdate = formatToMonthISO(formatToISO(dividend.date))
                return (ISOstartmonth <= ISOdate && ISOdate <= ISOendmonth)
              })
            })
            .catch(err => res.sendStatus(500))
          Promise
            .all([alphaDailyAdjusted, alphaMonthlyAdjusted])
            .then(done => isEmpty(dividends))
            .then(isEmpty => {
              if (isEmpty) {
                res.sendStatus(404)
              } else {
                res.status(200).json({
                  message: `${symbol} dividends from ${ISOstart} to ${ISOend}`,
                  dividends,
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
                dividends.days.push(day)
              }
            })
            months.forEach(month => {
              const ISOdate = formatToMonthISO(formatToISO(month.date))
              if (ISOstartmonth <= ISOdate && ISOdate <= ISOendmonth) {
                dividends.months.push(month)
              }
            })
          })
          if (isEmpty(dividends)) {
            res.sendStatus(404)
          } else {
            res.status(200).json({
              message: `${symbol} dividends from ${ISOstart} to ${ISOend}`,
              dividends
            })
          }
        }
      })
      .catch(err => res.sendStatus(500))
  }
})

module.exports = router