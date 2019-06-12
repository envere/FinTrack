const mongoose = require('mongoose')
const Schema = mongoose.Schema

const username = 'fintrack'
const password = 'nfactorialsorting'
const url = `mongodb+srv://${username}:${password}@fintrack-snwv2.mongodb.net/test?retryWrites=true&w=majority`

mongoose.connect(url, {useNewUrlParser: true, useCreateIndex: true})

const db = mongoose.connection
db.on('error', () => console.log('connection error to database'))
db.once('open', () => console.log('connected successfully to database'))

const UserSchema = new Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  password: String,
})

module.exports = mongoose.model('User', UserSchema)