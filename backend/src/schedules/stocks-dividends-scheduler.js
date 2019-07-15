const init = require('../util/init-stocks-dividends')
const alphavantage = require('../util/alphavantage')
const SymbolName = require('../models/symbol-name-model')
const StockPrice = require('../models/stock-price-model')
const DividendPrice = require('../models/dividend-price-model')

function getAllSymbols() {
  return SymbolName
    .find()
    .then(symbolnames => symbolnames.map(symbolname => symbolname.symbol))
    .catch(err => console.log(err))
}

function updateStock(symbol) {
  StockPrice
    .latest(symbol)
    .then(latest => {
      const days = latest.days
      let latestDate = days[0].date
      days.forEach(day => {
        if (day.date >= latestDate) {
          latestDate = day.date
        }
      })
      const latestYear = latestDate.getFullYear()
      const nowYear = (new Date).getFullYear()
      const years = []
      for (let i = latestYear + 1; i <= nowYear; ++i) {
        years.push(i)
      }
      const newBuckets = []
      years.forEach(year => {
        const stockprice = new StockPrice({symbol, year})
        newBuckets.push(stockprice.save())
      })
      Promise
        .all(newBuckets)
        .then(done => {
          const buckets = []
          buckets.push(StockPrice.latest(symbol))
          years.forEach(year => buckets.push(StockPrice.findOne({symbol, year})))
          return Promise.all(buckets)
        })
        .then(buckets => {
          const ISOdate = latestDate.toISOString().split('T')[0]
          const ISOnow = (new Date()).toISOString().split('T')[0]
          const days = alphavantage.daily.prices_range(symbol, ISOdate, ISOnow)
          const months = alphavantage.monthly.prices_range(symbol, ISOdate, ISOnow)
          Promise
            .all([days, months])
            .then(prices => {
              const days = prices[0]
              const months = prices[1]
              const map = new Map()
              buckets.forEach(bucket => map.set(bucket.year, bucket))
              days.forEach(price => map.get(price.date.getFullYear()).days.push(price))
              months.forEach(price => map.get(price.date.getFullYear()).months.push(price))
              const updateBuckets = buckets.map(bucket => {
                const year = bucket.year
                const days = bucket.days
                const months = bucket.months
                return StockPrice.findOneAndUpdate({symbol, year}, {days, months})
              })
              return Promise.all(updateBuckets)
            })
            .then(done => console.log(`updated ${symbol}'s stock\n${done}`))
            .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
}

function updateDividend(symbol) {

}

function update(symbol) {
  const stock = () => updateStock(stock)
  const dividend = () => updateDividend(stock)
  Promise
    .all([stock(), dividend()])
    .then(`${symbol}'s update completed`)
    .catch(err => console.log(err))
}

function updateAll() {
  getAllSymbols()
    .then(symbols => symbols.forEach(symbol => update(symbol)))
    .catch(err => console.log(err))
}

updateStock('MSFT')