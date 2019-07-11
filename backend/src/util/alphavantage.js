const axios = require('axios')
const alphavantageConfig = require('../configs/alphavantage-config')
const key = alphavantageConfig.key

// url
const intraday_url = alphavantageConfig.intraday_url
const daily_url = alphavantageConfig.daily_url
const daily_compact_url = alphavantageConfig.daily_compact_url
const daily_adjusted_url = alphavantageConfig.daily_adjusted_url
const daily_adjusted_compact_url = alphavantageConfig.daily_adjusted_compact_url
const monthly_url = alphavantageConfig.monthly_url
const monthly_adjusted_url = alphavantageConfig.monthly_adjusted_url

function intraday_equity(symbol) {
  return new Promise((resolve, reject) => {
    axios
      .get(intraday_url(symbol, key))
      .then(response => resolve(response.data))
      .catch(err => reject(err))
  })
}

function intraday_timeseries(symbol) {
  return new Promise((resolve, reject) => {
    intraday_equity(symbol)
      .then(data => resolve(data['Time Series (1min)']))
      .catch(err => reject(err))
  })
}

function intraday_latestprice(symbol) {
  return new Promise((resolve, reject) => {
    intraday_timeseries(symbol)
      .then(timeseries => {
        const keys = Object.keys(timeseries)
        const price = timeseries[keys[0]]['4. close']
        const date = new Date(keys[0])
        resolve({ date, price })
      })
      .catch(err => reject(err))
  })
}

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
        const price = timeseries[keys[0]]['4. close']
        const date = new Date(keys[0])
        const dateprice_pair = { date, price }
        resolve(dateprice_pair)
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
          return { date, price }
        })
        resolve(dateprice_pairs)
      })
      .catch(err => reject(err))
  })
}

function daily_prices_range(symbol, start, end) {
  const formatToISO = date => date.toISOString().split('T')[0]
  return new Promise((resolve, reject) => {
    daily_prices(symbol)
      .then(prices => prices.filter(price => start <= formatToISO(price.date) && formatToISO(price.date) <= end))
      .then(filteredprices => resolve(filteredprices))
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
        const price = timeseries[keys[0]]['4. close']
        const date = keys[0]
        resolve({date, price})
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
        const adjustedprice = timeseries[keys[0]]['5. adjusted close']
        const date = keys[0]
        resolve({date, adjustedprice})
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
        const dividend = timeseries[keys[0]]['7. dividend amount']
        const date = keys[0]
        resolve({date, dividend})
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
          return { date, price }
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
          return { date, adjustedprice }
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
          return { date, dividend }
        })
        resolve(datedividend_pairs)
      })
      .catch(err => reject(err))
  })
}

function dailyAdjusted_dividends_range(symbol, start, end) {
  const formatToISO = date => date.toISOString().split('T')[0]
  return new Promise((resolve, reject) => {
    dailyAdjusted_dividends(symbol)
      .then(dividends => dividends.filter(dividend => start <= formatToISO(dividend.date) && formatToISO(dividend.date) <= end))
      .then(filtereddividends => resolve(filtereddividends))
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
        const price = timeseries[keys[0]]['4. close']
        const date = new Date(keys[0])
        resolve({ date, price })
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
          return { date, price }
        })
        resolve(dateprice_pairs)
      })
      .catch(err => reject(err))
  })
}

function monthly_prices_range(symbol, start, end) {
  const formatToISO = date => {
    const format = date.toISOString().split('T')[0]
    const array = format.split('-')
    array.pop()
    return array.join('-')
  }
  return new Promise((resolve, reject) => {
    monthly_prices(symbol)
      .then(prices => prices.filter(price => start <= formatToISO(price.date) && formatToISO(price.date) <= end))
      .then(filteredprices => resolve(filteredprices))
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
        const price = timeseries[keys[0]]['4. close']
        const date = new Date(keys[0])
        resolve({ date, price })
      })
      .catch(err => reject(err))
  })
}

function monthlyAdjusted_latestadjustedprice(symbol) {
  return new Promise((resolve, reject) => {
    monthlyAdjusted_timeseries(symbol)
      .then(timeseries => {
        const keys = Object.keys(symbol)
        const adjustedprice = timeseries[keys[0]]['5. adjusted close']
        const date = new Date(keys[0])
        resolve({ date, adjustedprice })
      })
      .catch(err => reject(err))
  })
}

function monthlyAdjusted_latestdividend(symbol) {
  return new Promise((resolve, reject) => {
    monthlyAdjusted_timeseries(symbol)
      .then(timeseries => {
        const keys = Object.keys(symbol)
        const dividend = timeseries[keys[0]]['7. dividend amount']
        const date = new Date(keys[0])
        resolve({ date, dividend })
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
          return { date, price }
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
          return { date, adjustedprice }
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
          return { date, dividend }
        })
        resolve(datedividend_pairs)
      })
      .catch(err => reject(err))
  })
}

function monthlyAdjusted_dividends_range(symbol, start, end) {
  const formatToISO = date => {
    const format = date.toISOString().split('T')[0]
    const array = format.split('-')
    array.pop()
    return array.join('-')
  }
  return new Promise((resolve, reject) => {
    monthlyAdjusted_dividends(symbol)
      .then(dividends => dividends.filter(dividend => start <= formatToISO(dividend.date) && formatToISO(dividend.date) <= end))
      .then(filtereddividends => resolve(filtereddividends))
      .catch(err => reject(err))
  })
}

const intraday = {
  equity: intraday_equity,
  timeseries: intraday_timeseries,
  latestprice: intraday_latestprice,
}
const daily = {
  equity: daily_equity,
  timeseries: daily_timeseries,
  latestprice: daily_latestprice,
  prices: daily_prices,
  prices_range: daily_prices_range,
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
  dividends_range: dailyAdjusted_dividends_range,
}
const monthly = {
  equity: monthly_equity,
  timeseries: monthly_timeseries,
  latestprice: monthly_latestprice,
  prices: monthly_prices,
  prices_range: monthly_prices_range,
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
  dividends_range: monthlyAdjusted_dividends_range,
}

module.exports = {
  intraday: intraday,
  daily: daily,
  dailyAdjusted: dailyAdjusted,
  monthly: monthly,
  monthlyAdjusted: monthlyAdjusted,
}