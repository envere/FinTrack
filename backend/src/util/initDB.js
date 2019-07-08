const StockName = require('../models/StockNameModel')
const StockPrice = require('../models/StockPriceModel')
const DividendName = require('../models/DividendNameModel')
const DividendPrice = require('../models/DividendPriceModel')
const alphavantage = require('../util/alphavantage')

function initStock(symbol) {
  // StockName
  //   .deleteMany({ symbol })
  //   .then(done => {
  //     alphavantage
  //       .daily
  //       .latestprice(symbol)
  //       .then(latestprice => {
  //         const price = latestprice
  //         const stockname = new StockName({
  //           symbol,
  //           price,
  //         })
  //         stockname.save()
  //       })
  //       .catch(err => console.log(err))
  //   })
  //   .catch(err => console.log(err))
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

function initDividend(symbol) {
  // DividendName
  //   .deleteMany({ symbol })
  //   .then(done => {
  //     alphavantage
  //       .dailyAdjusted
  //       .latestdividend(symbol)
  //       .then(latestdividend => {
  //         const dividend = latestdividend
  //         const dividendname = new DividendName({
  //           symbol,
  //           dividend,
  //         })
  //         dividendname.save()
  //       })
  //       .catch(err => console.log(err))
  //   })
  //   .catch(err => console.log(err))
  DividendPrice
    .deleteMany({ symbol })
    .then(done => {
      alphavantage
        .monthlyAdjusted
        .dividends(symbol)
        .then(dividends => {
          const maxYear = dividends[0].date.getFullYear()
          const minYear = dividends[dividends.length - 1].date.getFullYear()

          const years = []
          for (let i = minYear; i <= maxYear; ++i) {
            years.push(i)
          }

          const buckets = new Map()
          years.forEach(year => buckets.set(year, new DividendPrice({ symbol, year })))

          dividends.forEach(dividend => {
            const year = dividend.date.getFullYear()
            const month = dividend.date.getMonth()
            const value = dividend.dividend
            const bucket = buckets.get(year)
            bucket.months.push({ date: dividend.date, dividend: value })
          })
          alphavantage
            .dailyAdjusted
            .dividends(symbol)
            .then(dividends => {
              dividends.forEach(dividend => {
                const year = dividend.date.getFullYear()
                const month = dividend.date.getMonth()
                const date = dividend.date.getDate()
                const value = dividend.dividend
                const bucket = buckets.get(year)
                bucket.days.push({ date: dividend.date, dividend: value })
              })
              return buckets
            })
            .then(buckets => buckets.forEach(dividendprice => dividendprice.save()))
            .then(done => console.log(`initialized ${symbol} dividends`))
            .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
}

module.exports = symbol => {
  initStock(symbol)
  initDividend(symbol)
}