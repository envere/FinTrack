// imports
const mongoose = require("mongoose")
const Schema = mongoose.Schema

// connection uri
const db = require('../configs/mongodb-config')
const uri = db.uri(db.username, db.password, db.server, db.database)

// connect to database
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    dbName: "fintrack_database"
  })
  .then(() => console.log("connected successfully to database [Transaction]"))
  .catch(err => console.log(`connection error to database [Transaction]\nerror: ${err}`))

const HistorySchema = new Schema({
  category: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  symbol: {
    type: String,
    required: true,
  },
  units: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    default: 0,
  },
  tradeValue: {
    type: Number,
    default: 0,
  },
}, { _id: false })

const TransactionSchema = new Schema({
  userid: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
  history: [HistorySchema],
})

const Transaction = mongoose.model('Transaction', TransactionSchema)

module.exports = Transaction