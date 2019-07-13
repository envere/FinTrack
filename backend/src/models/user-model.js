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
  .then(() => console.log('connected successfully to database [User]'))
  .catch(err => console.log(`connection error to database [User]\nerror: ${err}`))

const symbolSchema = new Schema({
  symbol: String,
  units: Number,
  initialvalue: Number,
}, { _id: false })

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  symbols: [symbolSchema],
})

UserSchema.index({ username: "text" })

const User = mongoose.model("User", UserSchema)

module.exports = User
