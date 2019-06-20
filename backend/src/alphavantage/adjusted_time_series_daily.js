const axios = require('axios')
const alphavantage = require('../configs/alphavantageConfig')
const Deque = require('../util/deque')

function getEquity(symbol) {
  return new Promise((resolve, reject) => {
    axios
      .get(alphavantage.requestJSON('TIME_SERIES_DAILY_ADJUSTED', symbol))
      .then(response => resolve(response.data))
      .catch(err => reject(err))
  })
}

function getTimeSeries(symbol) {
  return new Promise((resolve, reject) => {
    getEquity(symbol)
      .then(data => resolve(data['Time Series (Daily)']))
      .catch(err => reject(err))
  })
}

function getDividend(symbol) {
  return new Promise((resolve, reject) => {
    getTimeSeries(symbol)
      .then(timeSeries => {
        const firstKey = Object.keys(timeSeries)[0]
        const dividend = timeSeries[firstKey]['7. dividend amount']
        resolve(dividend)
      })
      .catch(err => reject(err))
  })
}

function initializeHistory(symbol) {
  return new Promise((resolve, reject) => {
    getTimeSeries(symbol)
      .then(timeSeries => {
        const deque = new Deque()
        for (const key in timeSeries) {
          deque.addLast(timeSeries[key]['7. dividend amount'])
        }
        resolve(deque)
      })
      .catch(err => reject(err))
  })
}

module.exports = {
  getEquity: getEquity,
  getTimeSeries: getTimeSeries,
  getDividend: getDividend,
  initializeHistory: initializeHistory,
}