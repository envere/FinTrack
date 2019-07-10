// imports
const mongoose = require("mongoose")
const Schema = mongoose.Schema

// connection uri
const db = require('../configs/mongodbConfig')
const uri = db.uri(db.username, db.password, db.server, db.database)

// connect to database
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    dbName: "fintrack_database"
  })
  .then(() => console.log("connected successfully to database [Blacklist]"))
  .catch(err => console.log(`connection error to database [Blacklist]\nerror: ${err}`))

const BlacklistSchema = new Schema({
  token: {
    type: String,
    required: true, 
    unique: true,
  },
  exp: {
    type: Number,
    required: true,
  },
  userid: {
    type: String,
    required: true,
  },
})

const Blacklist = mongoose.model('Blacklist', BlacklistSchema)

module.exports = Blacklist