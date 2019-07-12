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
  .then(() => console.log("connected successfully to database [Portfolio]"))
  .catch(err => console.log(`connection error to database [Portfolio]\nerror: ${err}`))

const SymbolSchema = new Schema({
  name: {
    type: String,
    default: "",
  },
  units: {
    type: Number,
    default: 0,
  },
  investedCapital: {
    type: Number,
    default: 0,
  },
  dividends: {
    type: Number,
    default: 0,
  },
  currentValue: {
    type: Number,
    default: 0,
  },
}, { _id: false })

const PortfolioSchema = new Schema({
  userid: {
    type: String,
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
  symbols: [SymbolSchema],
})

const Portfolio = mongoose.model('Portfolio', PortfolioSchema)

module.exports = Portfolio