const alphavantage = require('../util/alphavantage')
const StockPrice = require('../models/StockPriceModel')
const StockName = require('../models/StockNameModel')

function getSymbols() {
  return StockName
    .find()
    .then(stocknames => stocknames.map(stockname => stockname.symbol))
    .catch(err => console.log(err))
}

function updateStockNames() {
  getSymbols()
    .then(symbols => symbols.forEach(symbol => {
      alphavantage
        .daily
        .latestprice(symbol)
        .then(latestprice => {
          StockName
            .updateOne({ symbol }, { $set: { price: latestprice } })
            .then(done => console.log(`updated ${symbol} latest price`))
            .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
    }))
    .catch(err => console.log(err))
}

function updateStockPrices() {
  getSymbols()
    .then(symbols => symbols.forEach(symbol => {
      StockPrice
        .latest(symbol)
        .then(stockprice => {
          const latestday = stockprice.days[stockprice.days.length - 1]
          const latestmonth = stockprice.months[stockprice.months.length - 1]
          const existingdays = stockprice.days
          const existingmonths = stockprice.months
          const newbuckets = []
          alphavantage
            .daily
            .prices_range(symbol, latestday, new Date())
            .then(prices => {
              prices.pop()
              let index = prices.length - 1
              while (index >= 0) {
                const price = prices[index]
                if (price.date.getFullYear() !== stockprice.year) {
                  break
                } else {
                  existingdays.push(price)
                }
                ++index
              }
              let bucket = null
              for (let i = index; i >= 0; --i) {
                const price = prices[i]
                const year = price.date.getFullYear()
                if (!bucket || bucket.year !== year) {
                  bucket = new StockPrice({ symbol, year })
                  newbuckets.push(bucket)
                }
                bucket.days.push(price)
              }
              return newbuckets
            })
            .then(buckets => {
              alphavantage
                .monthly
                .prices_range(symbol, latestmonth, new Date())
                .then(prices => {
                  prices.pop()
                  let index = prices.length - 1
                  while (index >= 0) {
                    const price = prices[index]
                    if (price.date.getFullYear() !== stockprice.year) {
                      break
                    } else {
                      existingmonths.push(price)
                    }
                    ++index
                  }
                  for (let i = index; i >= 0; --i) {
                    const price = prices[i]
                    const year = price.date.getFullYear()
                    for (let i = 0; i < buckets.length; ++i) {
                      if (buckets[i].year === year) {
                        buckets[i].months.push(price)
                        break
                      }
                    }
                  }
                  return buckets
                })
                .then(buckets => {
                  StockPrice
                    .updateOne({ symbol, year: stockprice.year }, { $set: { days: existingdays, months: existingmonths } })
                    .catch(err => console.log(err))
                  buckets.forEach(bucket => bucket.save())
                })
            })
        })
    }))
    .catch(err => console.log(err))
}

setInterval(() => updateStockNames(), 100000)
setInterval(() => updateStockPrices(), 100000)