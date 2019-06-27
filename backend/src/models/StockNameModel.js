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
  .then(() => console.log("connected successfully to database [StockName]"))
  .catch(err => console.log(`connection error to database [StockName]\nerror: ${err}`))

const StockNameSchema = new Schema({
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

StockNameSchema.index({ symbol: "text", price: "text" })

const StockName = mongoose.model("StockName", StockNameSchema)

module.exports = StockName
