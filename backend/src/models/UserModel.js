const mongoose = require('mongoose')
const Schema = mongoose.Schema

const username = 'fintrack'
const password = 'nfactorialsorting'
const server = 'fintrack-snwv2.mongodb.net'
const database = 'fintrack_database'
const url = `mongodb+srv://${username}:${password}@${server}/${database}?retryWrites=true&w=majority`

mongoose.connect(url, {useNewUrlParser: true, useCreateIndex: true})

const db = mongoose.connection
db.on('error', () => console.log('connection error to database [UserModel.js]'))
db.once('open', () => console.log('connected successfully to database [UserModel.js]'))

const UserSchema = new Schema({
  name: { 
    type: String, 
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
  }
})

const User = mongoose.model('User', UserSchema)

module.exports = User