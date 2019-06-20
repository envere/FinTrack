const axios = require('axios')
const key = require('../configs/alphavantageConfig').key

const TIME_SERIES_DAILY = {
  getEquity: function(symbol) {
    axios
      .get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${key}`)
      .then(response => {
        const data = response.data
        console.log(data)
      })
  },
}

const TIME_SERIES_DAILY_ADJUSTED = {
  getEquity: function(symbol) {
    axios
      .get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&apikey=${key}`)
      .then(response => {
        const data = response.data
        console.log(data)
      })
  }
}

TIME_SERIES_DAILY.getEquity('MSFT')