const SymbolName = require('../models/symbol-name-model')
const StockPrice = require('../models/stock-price-model')
const DividendPrice = require('../models/dividend-price-model')
const alphavantage = require('../util/alphavantage')
const scrape = require('../util/scraper')

function initSymbolName(symbol) {
  console.log(`initSymbolName(${symbol})`)
  SymbolName
    .findOne({ symbol })
    .then(doc => {
      if (!doc) {
        const symbolname = new SymbolName({ symbol })
        return symbolname.save()
      } else {
        return null
      }
    })
    .then(saved => console.log(`initialized ${symbol} symbol name`))
    .catch(err => console.log(err))
}

function initStock(symbol) {
  console.log(`initStock(${symbol})`)
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
            .then(prices => prices.reverse())
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
  console.log(`initDividend(${symbol})`)
  DividendPrice
    .deleteMany({ symbol })
    .then(done => {
      const check = () => {
        const array = symbol.split('.')
        return array.length > 1 && array[1] === 'SI'
      }
      if (check()) {
        scrape(symbol)
          .then(dividends => dividends.reverse())
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
              bucket.days.push({ date: dividend.date, dividend: value })
            })

            return buckets
          })
          .then(buckets => buckets.forEach(dividendprice => dividendprice.save()))
          .then(done => console.log(`initialized ${symbol} dividends`))
          .catch(err => console.log(err))
      } else {
        alphavantage
          .monthlyAdjusted
          .dividends(symbol)
          .then(dividends => dividends.reverse())
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
              .then(dividends => dividends.reverse())
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
      }
    })
    .catch(err => console.log(err))
}

// function initDividend(symbol) {
//   console.log(`initDividend(${symbol})`)
//   DividendPrice
//     .deleteMany({ symbol })
//     .then(done => {
//       alphavantage
//         .monthlyAdjusted
//         .dividends(symbol)
//         .then(dividends => {
//           const maxYear = dividends[0].date.getFullYear()
//           const minYear = dividends[dividends.length - 1].date.getFullYear()

//           const years = []
//           for (let i = minYear; i <= maxYear; ++i) {
//             years.push(i)
//           }

//           const buckets = new Map()
//           years.forEach(year => buckets.set(year, new DividendPrice({ symbol, year })))

//           dividends.forEach(dividend => {
//             const year = dividend.date.getFullYear()
//             const month = dividend.date.getMonth()
//             const value = dividend.dividend
//             const bucket = buckets.get(year)
//             bucket.months.push({ date: dividend.date, dividend: value })
//           })
//           alphavantage
//             .dailyAdjusted
//             .dividends(symbol)
//             .then(dividends => {
//               dividends.forEach(dividend => {
//                 const year = dividend.date.getFullYear()
//                 const month = dividend.date.getMonth()
//                 const date = dividend.date.getDate()
//                 const value = dividend.dividend
//                 const bucket = buckets.get(year)
//                 bucket.days.push({ date: dividend.date, dividend: value })
//               })
//               return buckets
//             })
//             .then(buckets => buckets.forEach(dividendprice => dividendprice.save()))
//             .then(done => console.log(`initialized ${symbol} dividends`))
//             .catch(err => console.log(err))
//         })
//         .catch(err => console.log(err))
//     })
//     .catch(err => console.log(err))
// }

module.exports = symbol => {
  initSymbolName(symbol)
  initStock(symbol)
  initDividend(symbol)
}