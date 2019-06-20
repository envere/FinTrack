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