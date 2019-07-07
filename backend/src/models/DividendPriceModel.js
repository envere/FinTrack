// imports
const mongoose = require("mongoose")
const Schema = mongoose.Schema

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
  .then(() => console.log("connected successfully to database [DividendPrice]"))
  .catch(err => console.log(`connection error to database [DividendPrice]\nerror: ${err}`))


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
  days: [],
  months: [],
})

DividendPriceSchema.statics.latest = function (symbol) {
  return this
    .find({ symbol })
    .sort({ year: -1 })
    .then(sorted => sorted[0])
    .catch(err => console.log(err))
}

DividendPriceSchema.statics.range = function (symbol, start, end) {
  const startyear = start.getFullYear()
  const endyear = end.getFullYear()
  return this
    .find({ symbol })
    .then(data => data.filter(bucket => startyear <= bucket.year && bucket.year <= endyear))
    .catch(err => console.log(err))
}

const DividendPrice = mongoose.model('DividendPrice', DividendPriceSchema)

module.exports = DividendPrice