const StockPrice = require('../models/StockPriceModel')
const DividendPrice = require('../models/DividendPriceModel')
const alphavantage = require('../util/alphavantage')

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

function initDividendHistory(symbol) {
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
            const value = dividend.price
            const bucket = buckets.get(year)
            bucket.months.push({ date: dividend.date, price: value })
          })
          alphavantage
            .dailyAdjusted
            .dividends(symbol)
            .then(dividends => {
              dividends.forEach(dividend => {
                const year = dividend.date.getFullYear()
                const month = dividend.date.getMonth()
                const date = dividend.date.getDate()
                const value = dividend.price
                const bucket = buckets.get(year)
                bucket.days.push({ date: dividend.date, price: value })
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
  initPriceHistory(symbol)
  initDividendHistory(symbol)
}