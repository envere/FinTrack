// imports
const mongoose = require('mongoose')
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
    dbName: 'fintrack_database'
  })
  .then(() => console.log('connected successfully to database [Symbol Name]'))
  .catch(err => console.log(`connection error to database [Symbol Name]\nerror: ${err}`))

const SymbolNameSchema = new Schema({
  symbol: {
    type: String,
    required: true,
    unique: true,
  },
})

const SymbolName = mongoose.model('SymbolName', SymbolNameSchema)

module.exports = SymbolName