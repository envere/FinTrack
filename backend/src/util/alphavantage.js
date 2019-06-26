const axios = require('axios')
const alphavantageConfig = require('../configs/alphavantageConfig')
const key = alphavantageConfig.key

// url
const daily_url = alphavantageConfig.daily_url
const daily_compact_url = alphavantageConfig.daily_compact_url
const daily_adjusted_url = alphavantageConfig.daily_adjusted_url
const daily_adjusted_compact_url = alphavantageConfig.daily_adjusted_compact_url
const weekly_url = alphavantageConfig.weekly_url
const weekly_adjusted_url = alphavantageConfig.weekly_adjusted_url
const monthly_url = alphavantageConfig.monthly_url
const monthly_adjusted_url = alphavantageConfig.monthly_adjusted_url

function daily_equity(symbol) {
  return new Promise((resolve, reject) => {
    axios
      .get(daily_url(symbol, key))
      .then(response => resolve(response.data))
      .catch(err => reject(err))
  })
}

function daily_timeseries(symbol) {
  return new Promise((resolve, reject) => {
    daily_equity(symbol)
      .then(data => resolve(data['Time Series (Daily)']))
      .catch(err => reject(err))
  })
}

function daily_latestprice(symbol) {
  return new Promise((resolve, reject) => {
    axios
      .get(daily_compact_url(symbol, key))
      .then(response => response.data)
      .then(data => data['Time Series (Daily)'])
      .then(timeseries => {
        const keys = Object.keys(timeseries)
        const latestprice = timeseries[keys[0]]['4. close']
        resolve(latestprice)
      })
      .catch(err => reject(err))
  })
}

function daily_prices(symbol) {
  return new Promise((resolve, reject) => {
    daily_timeseries(symbol)
      .then(timeseries => {
        const keys = Object.keys(timeseries)
        const dateprice_pairs = keys.map(key => {
          const date = new Date(key)
          const price = timeseries[key]['4. close']
          return {date, price}
        })
        resolve(dateprice_pairs)
      })
      .catch(err => reject(err))
  })
}

function dailyAdjusted_equity(symbol) {
  return new Promise((resolve, reject) => {
    axios
      .get(daily_adjusted_url(symbol, key))
      .then(response => resolve(response.data))
      .catch(err => reject(err))
  })
}

function dailyAdjusted_timeseries(symbol) {
  return new Promise((resolve, reject) => {
    dailyAdjusted_equity(symbol)
      .then(data => data['Time Series (Daily)'])
      .then(timeseries => resolve(timeseries))
      .catch(err => reject(err))
  })
}

function dailyAdjusted_latestprice(symbol) {
  return new Promise((resolve, reject) => {
    axios
      .get(daily_adjusted_compact_url(symbol, key))
      .then(response => response.data)
      .then(data => data['Time Series (Daily)'])
      .then(timeseries => {
        const keys = Object.keys(timeseries)
        const latestprice = timeseries[keys[0]]['4. close']
        resolve(latestprice)
      })
      .catch(err => reject(err))
  })
}

function dailyAdjusted_latestadjustedprice(symbol) {
  return new Promise((resolve, reject) => {
    axios
      .get(daily_adjusted_compact_url(symbol, key))
      .then(response => response.data)
      .then(data => data['Time Series (Daily)'])
      .then(timeseries => {
        const keys = Object.keys(timeseries)
        const latestadjustedprice = timeseries[keys[0]]['5. adjusted close']
        resolve(latestadjustedprice)
      })
      .catch(err => reject(err))
  })
}

function dailyAdjusted_latestdividend(symbol) {
  return new Promise((resolve, reject) => {
    axios
      .get(daily_adjusted_compact_url(symbol, key))
      .then(response => response.data)
      .then(data => data['Time Series (Daily)'])
      .then(timeseries => {
        const keys = Object.keys(timeseries)
        const latestdividend = timeseries[keys[0]]['7. dividend amount']
        resolve(latestdividend)
      })
      .catch(err => reject(err))
  })
}

function dailyAdjusted_prices(symbol) {
  return new Promise((resolve, reject) => {
    axios
      .get(daily_adjusted_url(symbol, key))
      .then(response => response.data)
      .then(data => data['Time Series (Daily)'])
      .then(timeseries => {
        const keys = Object.keys(timeseries)
        const dateprice_pairs = keys.map(key => {
          const date = new Date(key)
          const price = timeseries[key]['4. close']
          return {date, price}
        })
        resolve(dateprice_pairs)
      })
      .catch(err => reject(err))
  })
}

function dailyAdjusted_adjustedprices(symbol) {
  return new Promise((resolve, reject) => {
    dailyAdjusted_timeseries(symbol)
      .then(timeseries => {
        const keys = Object.keys(timeseries)
        const dateadjustedprice_pairs = keys.map(key => {
          const date = new Date(key)
          const adjustedprice = timeseries[key]['5. adjusted close']
          return {date, adjustedprice}
        })
        resolve(dateadjustedprice_pairs)
      })
      .catch(err => reject(err))
  })
}

function dailyAdjusted_dividends(symbol) {
  return new Promise((resolve, reject) => {
    dailyAdjusted_timeseries(symbol)
      .then(timeseries => {
        const keys = Object.keys(timeseries)
        const datedividend_pairs = keys.map(key => {
          const date = new Date(key)
          const dividend = timeseries[key]['7. dividend amount']
          return {date, dividend}
        })
        resolve(datedividend_pairs)
      })
      .catch(err => reject(err))
  })
}

function weekly_equity(symbol) {
  return new Promise((resolve, reject) => {
    axios
      .get(weekly_url(symbol, key))
      .then(response => resolve(response.data))
      .catch(err => reject(err))
  })
}

function weekly_timeseries(symbol) {
  return new Promise((resolve, reject) => {
    weekly_equity(symbol)
      .then(data => resolve(data['Weekly Time Series']))
      .catch(err => reject(err))
  })
}

function weekly_latestprice(symbol) {
  return new Promise((resolve, reject) => {
    weekly_timeseries(symbol)
      .then(timeseries => {
        const keys = Object.keys(timeseries)
        const latestprice = timeseries[keys[0]]['4. close']
        resolve(latestprice)
      })
      .catch(err => reject(err))
  })
}

function weekly_prices(symbol) {
  return new Promise((resolve, reject) => {
    weekly_timeseries(symbol)
      .then(timeseries => {
        const keys = Object.keys(timeseries)
        const dateprice_pairs = keys.map(key => {
          const date = new Date(key)
          const price = timeseries[key]['4. close']
          return {date, price}
        })
        resolve(dateprice_pairs)
      })
      .catch(err => reject(err))
  })
}

function weeklyAdjusted_equity(symbol) {
  return new Promise((resolve, reject) => {
    axios
      .get(weekly_adjusted_url(symbol, key))
      .then(response => resolve(response.data))
      .catch(err => reject(err))
  })
}

function weeklyAdjusted_timeseries(symbol) {
  return new Promise((resolve, reject) => {
    weeklyAdjusted_equity(symbol)
      .then(data => resolve(data['Weekly Adjusted Time Series']))
      .catch(err => reject(err))
  })
}

function weeklyAdjusted_latestprice(symbol) {
  return new Promise((resolve, reject) => {
    weeklyAdjusted_timeseries(symbol)
      .then(timeseries => {
        const keys = Object.keys(symbol)
        const latestprice = timeseries[keys[0]]['4. close']
        resolve(latestprice)
      })
      .catch(err => reject(err))
  })
}

function weeklyAdjusted_latestadjustedprice(symbol) {
  return new Promise((resolve, reject) => {
    weeklyAdjusted_timeseries(symbol)
      .then(timeseries => {
        const keys = Object.keys(symbol)
        const latestprice = timeseries[keys[0]]['5. adjusted close']
        resolve(latestprice)
      })
      .catch(err => reject(err))
  })
}

function weeklyAdjusted_latestdividend(symbol) {
  return new Promise((resolve, reject) => {
    weeklyAdjusted_timeseries(symbol)
      .then(timeseries => {
        const keys = Object.keys(symbol)
        const latestprice = timeseries[keys[0]]['7. dividend amount']
        resolve(latestprice)
      })
      .catch(err => reject(err))
  })
}

function weeklyAdjusted_prices(symbol) {
  return new Promise((resolve, reject) => {
    weeklyAdjusted_timeseries(symbol)
      .then(timeseries => {
        const keys = Object.keys(timeseries)
        const dateprice_pairs = keys.map(key => {
          const date = new Date(key)
          const price = timeseries[key]['4. close']
          return {date, price}
        })
        resolve(dateprice_pairs)
      })
      .catch(err => reject(err))
  })
}

function weeklyAdjusted_adjustedprices(symbol) {
  return new Promise((resolve, reject) => {
    weeklyAdjusted_timeseries(symbol)
      .then(timeseries => {
        const keys = Object.keys(timeseries)
        const dateadjustedprice_pairs = keys.map(key => {
          const date = new Date(key)
          const adjustedprice = timeseries[key]['5. adjusted close']
          return {date, adjustedprice}
        })
        resolve(dateadjustedprice_pairs)
      })
      .catch(err => reject(err))
  })
}

function weeklyAdjusted_dividends(symbol) {
  return new Promise((resolve, reject) => {
    weeklyAdjusted_timeseries(symbol)
      .then(timeseries => {
        const keys = Object.keys(timeseries)
        const datedividend_pairs = keys.map(key => {
          const date = new Date(key)
          const dividend = timeseries[key]['7. dividend amount']
          return {date, dividend}
        })
        resolve(datedividend_pairs)
      })
      .catch(err => reject(err))
  })
}

function monthly_equity(symbol) {
  return new Promise((resolve, reject) => {
    axios
      .get(monthly_url(symbol, key))
      .then(response => resolve(response.data))
      .catch(err => reject(err))
  })
}

function monthly_timeseries(symbol) {
  return new Promise((resolve, reject) => {
    monthly_equity(symbol)
      .then(data => resolve(data['Monthly Time Series']))
      .catch(err => reject(err))
  })
}

function monthly_latestprice(symbol) {
  return new Promise((resolve, reject) => {
    monthly_timeseries(symbol)
      .then(timeseries => {
        const keys = Object.keys(timeseries)
        const latestprice = timeseries[keys[0]]['4. close']
        resolve(latestprice)
      })
      .catch(err => reject(err))
  })
}

function monthly_prices(symbol) {
  return new Promise((resolve, reject) => {
    monthly_timeseries(symbol)
      .then(timeseries => {
        const keys = Object.keys(timeseries)
        const dateprice_pairs = keys.map(key => {
          const date = new Date(key)
          const price = timeseries[key]['4. close']
          return {date, price}
        })
        resolve(dateprice_pairs)
      })
      .catch(err => reject(err))
  })
}

function monthlyAdjusted_equity(symbol) {
  return new Promise((resolve, reject) => {
    axios
      .get(monthly_adjusted_url(symbol, key))
      .then(response => resolve(response.data))
      .catch(err => reject(err))
  })
}

function monthlyAdjusted_timeseries(symbol) {
  return new Promise((resolve, reject) => {
    monthlyAdjusted_equity(symbol)
      .then(data => resolve(data['Monthly Adjusted Time Series']))
      .catch(err => reject(err))
  })
}

function monthlyAdjusted_latestprice(symbol) {
  return new Promise((resolve, reject) => {
    monthlyAdjusted_timeseries(symbol)
      .then(timeseries => {
        const keys = Object.keys(symbol)
        const latestprice = timeseries[keys[0]]['4. close']
        resolve(latestprice)
      })
      .catch(err => reject(err))
  })
}

function monthlyAdjusted_latestadjustedprice(symbol) {
  return new Promise((resolve, reject) => {
    monthlyAdjusted_timeseries(symbol)
      .then(timeseries => {
        const keys = Object.keys(symbol)
        const latestprice = timeseries[keys[0]]['5. adjusted close']
        resolve(latestprice)
      })
      .catch(err => reject(err))
  })
}

function monthlyAdjusted_latestdividend(symbol) {
  return new Promise((resolve, reject) => {
    monthlyAdjusted_timeseries(symbol)
      .then(timeseries => {
        const keys = Object.keys(symbol)
        const latestprice = timeseries[keys[0]]['7. dividend amount']
        resolve(latestprice)
      })
      .catch(err => reject(err))
  })
}

function monthlyAdjusted_prices(symbol) {
  return new Promise((resolve, reject) => {
    monthlyAdjusted_timeseries(symbol)
      .then(timeseries => {
        const keys = Object.keys(timeseries)
        const dateprice_pairs = keys.map(key => {
          const date = new Date(key)
          const price = timeseries[key]['4. close']
          return {date, price}
        })
        resolve(dateprice_pairs)
      })
      .catch(err => reject(err))
  })
}

function monthlyAdjusted_adjustedprices(symbol) {
  return new Promise((resolve, reject) => {
    monthlyAdjusted_timeseries(symbol)
      .then(timeseries => {
        const keys = Object.keys(timeseries)
        const dateadjustedprice_pairs = keys.map(key => {
          const date = new Date(key)
          const adjustedprice = timeseries[key]['5. adjusted close']
          return {date, adjustedprice}
        })
        resolve(dateadjustedprice_pairs)
      })
      .catch(err => reject(err))
  })
}

function monthlyAdjusted_dividends(symbol) {
  return new Promise((resolve, reject) => {
    monthlyAdjusted_timeseries(symbol)
      .then(timeseries => {
        const keys = Object.keys(timeseries)
        const datedividend_pairs = keys.map(key => {
          const date = new Date(key)
          const dividend = timeseries[key]['7. dividend amount']
          return {date, dividend}
        })
        resolve(datedividend_pairs)
      })
      .catch(err => reject(err))
  })
}

const daily = {
  equity: daily_equity,
  timeseries: daily_timeseries,
  latestprice: daily_latestprice,
  prices: daily_prices,
}
const dailyAdjusted = {
  equity: dailyAdjusted_equity,
  timeseries: dailyAdjusted_timeseries,
  latestprice: dailyAdjusted_latestprice,
  latestadjustedprice: dailyAdjusted_latestadjustedprice,
  latestdividend: dailyAdjusted_latestdividend,
  prices: dailyAdjusted_prices,
  adjustedprices: dailyAdjusted_adjustedprices,
  dividends: dailyAdjusted_dividends,
}
const weekly = {
  equity: weekly_equity,
  timeseries: weekly_timeseries,
  latestprice: weekly_latestprice,
  prices: weekly_prices,
}
const weeklyAdjusted = {
  equity: weeklyAdjusted_equity,
  timeseries: weeklyAdjusted_timeseries,
  latestprice: weeklyAdjusted_latestprice,
  latestadjustedprice: weeklyAdjusted_latestadjustedprice,
  latestdividend: weeklyAdjusted_latestdividend,
  prices: weeklyAdjusted_prices,
  adjustedprices: weeklyAdjusted_adjustedprices,
  dividends: weeklyAdjusted_dividends,
}
const monthly = {
  equity: monthly_equity,
  timeseries: monthly_timeseries,
  latestprice: monthly_latestprice,
  prices: monthly_prices,
}
const monthlyAdjusted = {
  equity: monthlyAdjusted_equity,
  timeseries: monthlyAdjusted_timeseries,
  latestprice: monthlyAdjusted_latestprice,
  latestadjustedprice: monthlyAdjusted_latestadjustedprice,
  latestdividend: monthlyAdjusted_latestdividend,
  prices: monthlyAdjusted_prices,
  adjustedprices: monthlyAdjusted_adjustedprices,
  dividends: monthlyAdjusted_dividends,
}

module.exports = {
  daily: daily,
  dailyAdjusted: dailyAdjusted,
  weekly: weekly,
  weeklyAdjusted: weeklyAdjusted,
  monthly: monthly,
  monthlyAdjusted: monthlyAdjusted,
}