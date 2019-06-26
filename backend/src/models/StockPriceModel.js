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
  daily: [],
  weekly: [],
  monthly: [],
})

StockPriceSchema.methods.addDailyPrice = function (date, price) {
  this.daily.push({ date, price })
}

StockPriceSchema.methods.addWeeklyPrice = function (date, price) {
  this.weekly.push({ date, price })
}

StockPriceSchema.methods.addMonthlyPrice = function (date, price) {
  this.monthly.push({ date, price })
}


const StockPrice = mongoose.model('StockPrice', StockPriceSchema)

module.exports = StockPrice