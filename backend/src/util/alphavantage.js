const axios = require('axios')
const requestJSON = require('../configs/alphavantageConfig').requestJSON

const time_series_daily = {
  equity: function (symbol) {
    return new Promise((resolve, reject) => {
      const request = requestJSON('TIME_SERIES_DAILY', symbol)
      axios
        .get(request)
        .then(response => response.data)
        .then(data => resolve(data))
        .catch(err => reject(err))
    })
  },
  time_series: function (symbol) {
    return new Promise((resolve, reject) => {
      const equity = this.equity
      equity(symbol)
        .then(data => data['Time Series (Daily)'])
        .then(timeseries => resolve(timeseries))
        .catch(err => reject(err))
    })
  },
}

const time_series_daily_adjusted = {
  equity: function (symbol) {
    return new Promise((resolve, reject) => {
      const request = requestJSON('TIME_SERIES_DAILY_ADJUSTED', symbol)
      axios
        .get(request)
        .then(response => response.data)
        .then(data => resolve(data))
        .catch(err => reject(err))
    })
  },
  time_series(symbol) {
    return new Promise((resolve, reject) => {
      const equity = this.equity
      equity(symbol)
        .then(data => data['Time Series (Daily)'])
        .then(timeseries => resolve(timeseries))
        .catch(err => reject(err))
    })
  },
}

module.exports = {
  time_series_daily: time_series_daily,
  time_series_daily_adjusted: time_series_daily_adjusted,
}