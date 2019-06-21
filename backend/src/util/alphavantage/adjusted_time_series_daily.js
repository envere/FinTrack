const axios = require('axios')
const alphavantage = require('../configs/alphavantageConfig')
const Deque = require('../util/deque')

function equity(symbol) {
  return new Promise((resolve, reject) => {
    axios
      .get(alphavantage.requestJSON('TIME_SERIES_DAILY_ADJUSTED', symbol))
      .then(response => resolve(response.data))
      .catch(err => reject(err))
  })
}

function timeSeries(symbol) {
  return new Promise((resolve, reject) => {
    equity(symbol)
      .then(data => resolve(data['Time Series (Daily)']))
      .catch(err => reject(err))
  })
}

function dividend(symbol) {
  return new Promise((resolve, reject) => {
    timeSeries(symbol)
      .then(series => {
        const firstKey = Object.keys(series)[0]
        const div = series[firstKey]['7. dividend amount']
        resolve(div)
      })
      .catch(err => reject(err))
  })
}

function initDividendHistory(symbol) {
  return new Promise((resolve, reject) => {
    timeSeries(symbol)
      .then(series => {
        const deque = new Deque()
        for (const key in series) {
          deque.addLast(series[key]['7. dividend amount'])
        }
        resolve(deque)
      })
      .catch(err => reject(err))
  })
}

module.exports = {
  equity: equity,
  timeSeries: timeSeries,
  dividend: dividend,
  initDividendHistory: initDividendHistory,
}