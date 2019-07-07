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
  .then(() => console.log("connected successfully to database [DividendName]"))
  .catch(err => console.log(`connection error to database [DividendName]\nerror: ${err}`))

const DividendNameSchema = new Schema({
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

DividendNameSchema.index({ symbol: "text", price: "text" })

const DividendName = mongoose.model("DividendName", DividendNameSchema)

module.exports = DividendName