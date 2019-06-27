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

function updateStockPrice() {
  getSymbols()
    .then(symbols => symbols.forEach(symbol => {

    }))
    .catch(err => console.log(err))
}

console.log((new Date).getDate())