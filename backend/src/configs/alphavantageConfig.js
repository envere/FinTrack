module.exports = {
  key: '2TU1SD6EZTVECMLR',
  requestJSON: function(category, symbol) {
    return `https://www.alphavantage.co/query?function=${category}&symbol=${symbol}&apikey=${this.key}`
  },
  requestCSV: function(category, symbol) {
    return this.requestJSON(category, symbol) + '&datatype=csv'
  },
}