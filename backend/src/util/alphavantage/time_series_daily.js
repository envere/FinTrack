const axios = require('axios')
const alphavantage = require('../configs/alphavantageConfig')
const Deque = require('../util/deque')

function equity(symbol) {
  return new Promise((resolve, reject) => {
    axios
      .get(alphavantage.requestJSON('TIME_SERIES_DAILY', symbol))
      .then(response => resolve(response.data))
      .catch(err => reject(err))
  })
}

function timeSeries(symbol) {
  return new Promise((resolve, reject) => {
    getEquity(symbol)
      .then(data => resolve(data['Time Series (Daily)']))
      .catch(err => reject(err))
  })
}

function closePrice(symbol) {
  return new Promise((resolve, reject) => {
    timeSeries(symbol)
      .then(series => {
        const firstKey = Object.keys(series)[0]
        const price = series[firstKey]['4. close']
        resolve(price)
      })
      .catch(err => reject(err))
  })
}

function initClosePriceHistory(symbol) {
  return new Promise((resolve, reject) => {
    timeSeries(symbol)
      .then(series => {
        const deque = new Deque()
        for (const key in series) {
          deque.addLast(series[key]['4. close'])
        }
        resolve(deque)
      })
      .catch(err => reject(err))
  })
}

module.exports = {
  equity: equity,
  timeSeries: timeSeries,
  closePrice: closePrice,
  initClosePriceHistory: initClosePriceHistory,
}