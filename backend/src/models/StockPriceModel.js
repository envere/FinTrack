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
    unique: true,
    uppercase: true,
  },
  price: {
    type: Number,
    required: true,
  }
})

StockPriceSchema.index({ symbol: "text", price: "text" })

const StockPrice = mongoose.model("StockPrice", StockPriceSchema)

module.export = StockPrice
