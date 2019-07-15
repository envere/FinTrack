const init = require('../util/init-stocks-dividends')
const alphavantage = require('../util/alphavantage')
const SymbolName = require('../models/symbol-name-model')
const StockPrice = require('../models/stock-price-model')
const DividendPrice = require('../models/dividend-price-model')

function getAllSymbols() {
  return SymbolName
    .find()
    .then(symbolnames => symbolnames.filter(symbolname => symbolname.symbol))
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
      for (let i = latestYear + 1; i <= 2021; ++i) {
        years.push(i)
      }
      const buckets = []
      buckets.push(StockPrice.latest(symbol))
      years.forEach(year => {
        const stockprice = new StockPrice({
          symbol,
          year,
        })
        buckets.push(stockprice.save())
      })
      Promise
        .all(buckets)
        .then(buckets => {
          const ISOdate = latestDate.toISOString().split('T')[0]
          const ISOnow = (new Date()).toISOString().split('T')[0]
          const days = alphavantage.daily.prices_range(symbol, ISOdate, ISOnow)
          const months = alphavantage.monthly.prices_range(symbol, ISOdate, ISOnow)
          return Promise
            .all([days, months])
            .then(data => {
              const days = data[0]
              const months = data[1]
              return {
                buckets,
                days,
                months,
              }
            })
        })
        .then(data => console.log(data))
        .catch(err => console.log(err))
      const ISOdate = latestDate.toISOString().split('T')[0]
      const ISOnow = (new Date()).toISOString().split('T')[0]

    })
    .then(buckets => {
      const days = alphavantage.days
      const months = alphavantage.month
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

init('MSFT')