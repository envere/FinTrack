const SymbolName = require('../models/symbol-name-model')
const StockPrice = require('../models/stock-price-model')
const DividendPrice = require('../models/dividend-price-model')
const alphavantage = require('../util/alphavantage')
const scrape = require('../util/scraper')

function initSymbolName(symbol) {
  console.log(`initSymbolName(${symbol})`)
  SymbolName
    .deleteMany({ symbol })
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
        .then(prices => prices.reverse())
        .then(prices => {
          const minYear = prices[0].date.getFullYear()
          const maxYear = prices[prices.length - 1].date.getFullYear()
          console.log(`stock: min = ${minYear}, max = ${maxYear}`)

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
      const parse = () => symbol.split('.')[0]
      console.log(check(), parse())
      if (check()) {
        scrape(parse())
          .then(dividends => dividends.reverse())
          .then(dividends => {
            if (dividends.length === 0) {
              return []
            }
            const minYear = dividends[0].date.getFullYear()
            const maxYear = dividends[dividends.length - 1].date.getFullYear()
            console.log(`div: min = ${minYear}, max = ${maxYear}`)

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
            const minYear = dividends[0].date.getFullYear()
            const maxYear = dividends[dividends.length - 1].date.getFullYear()
            console.log(`div: min = ${minYear}, max = ${maxYear}`)

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

const init = symbol => {
  initSymbolName(symbol)
  initStock(symbol)
  initDividend(symbol)
}

module.exports = init

const symbols = () => SymbolName.find().then(x => x.map(y => y.symbol)).then(console.log).catch(console.log)
const fetch = async symbol => {
  try {
    const stock = StockPrice.find({ symbol })
    const div = DividendPrice.find({ symbol })
    const done = await Promise.all([stock, div]).catch(console.log)
    const s = done[0][0].days
    const d = done[1][0].days
    console.log('stock')
    s.forEach(x => console.log(JSON.stringify(x)))
    console.log('div')
    d.forEach(x => console.log(JSON.stringify(x)))
  } catch (err) { console.log(err) }
}