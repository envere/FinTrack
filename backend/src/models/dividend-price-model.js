// imports
const mongoose = require("mongoose")
const Schema = mongoose.Schema

// connection uri
const db = require("../configs/mongodb-config")
const uri = db.uri(db.username, db.password, db.server, db.database)

// connect to database
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    dbName: "fintrack_database"
  })
  .then(() => console.log("connected successfully to database [DividendPrice]"))
  .catch(err => console.log(`connection error to database [DividendPrice]\nerror: ${err}`))

const DividendSchema = new Schema({
  dividend: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    required: true,
  },
}, { _id: false })

const DividendPriceSchema = new Schema({
  symbol: {
    type: String,
    required: true,
    uppercase: true,
  },
  year: {
    type: Number,
    required: true,
  },
  days: [DividendSchema],
  months: [DividendSchema],
})

DividendPriceSchema.statics.latest = function (symbol) {
  return this
    .find({ symbol })
    .sort({ year: -1 })
    .then(sorted => sorted.length === 0 ? null : sorted[0])
}

DividendPriceSchema.statics.range = function (symbol, start, end) {
  const formatISO = ISOdate => ISOdate.split('-')
  const startyear = formatISO(start)[0]
  const endyear = formatISO(end)[0]
  return this
    .find({ symbol })
    .then(data => data.filter(bucket => startyear <= bucket.year && bucket.year <= endyear))
    .catch(err => console.log(err))
}

const DividendPrice = mongoose.model('DividendPrice', DividendPriceSchema)

module.exports = DividendPrice