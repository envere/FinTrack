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
  .then(() => console.log("connected successfully to database [PortfolioHistory]"))
  .catch(err => console.log(`connection error to database [PortfolioHistory]\nerror: ${err}`))

const HistorySchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  totalCapital: {
    type: Number,
    default: 0,
  },
  totalValue: {
    type: Number,
    default: 0,
  },
  realisedProfits: {
    type: Number,
    default: 0,
  },
}, { _id: false })

const PortfolioHistorySchema = new Schema({
  userid: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  history: [HistorySchema]
})

const PortfolioHistory = mongoose.model('PortfolioHistory', PortfolioHistorySchema)

module.exports = PortfolioHistory