// imports
const mongoose = require("mongoose")
const Schema = mongoose.Schema
const alphavantage = require('../util/alphavantage')

// connection uri
const db = require("../configs/mongodbConfig")
const uri = db.uri(db.username, db.password, db.server, db.database)

// connect to database
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    dbName: "fintrack_database"
  })
  .then(() => console.log("connected successfully to database [StockPrice]"))
  .catch(err => console.log(`connection error to database [StockPrice]\nerror: ${err}`))


const StockPriceSchema = new Schema({
  symbol: {
    type: String,
    required: true,
    uppercase: true,
  },
  year: {
    type: Number,
    required: true,
  },
  days: [],
  months: [],
})

StockPriceSchema.statics.latest = function (symbol) {
  return this
    .find({ symbol })
    .sort({ year: -1 })
    .then(sorted => sorted[0])
    .catch(err => console.log(err))
}

StockPriceSchema.statics.range = function (symbol, start, end) {
  const formatISO = ISOdate => ISOdate.split('-')
  const startyear = formatISO(start)[0]
  const endyear = formatISO(end)[0]
  return this
    .find({ symbol })
    .then(data => data.filter(bucket => startyear <= bucket.year && bucket.year <= endyear))
    .catch(err => console.log(err))
}

const StockPrice = mongoose.model('StockPrice', StockPriceSchema)

module.exports = StockPrice