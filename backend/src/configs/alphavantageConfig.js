module.exports = {
  key: '2TU1SD6EZTVECMLR',
  daily_url: function (symbol, key) {
    return `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=full&apikey=${key}`
  },
  daily_compact_url: function (symbol, key) {
    return `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${key}`
  },
  daily_adjusted_url: function (symbol, key) {
    return `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&outputsize=full&apikey=${key}`
  },
  daily_adjusted_compact_url: function (symbol, key) {
    return `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&apikey=${key}`
  },
  weekly_url: function (symbol, key) {
    return `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=${symbol}&apikey=${key}`
  },
  weekly_adjusted_url: function (symbol, key) {
    return `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol=${symbol}&apikey=${key}`
  },
  monthly_url: function (symbol, key) {
    return `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${symbol}&apikey=${key}`
  },
  monthly_adjusted_url: function (symbol, key) {
    return `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${symbol}&apikey=${key}`
  },
}