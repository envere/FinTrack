const mongoose = require('mongoose')

const username = 'fintrack'
const password = 'nfactorialsorting'
const url = `mongodb+srv://${username}:${password}@fintrack-snwv2.mongodb.net/test?retryWrites=true&w=majority`

mongoose.connect(url, {useNewUrlParser: true})

const UserSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: String,
})

module.exports = mongoose.model('User', UserSchema)