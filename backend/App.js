const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const url = 'mongodb+srv://fintrack:nfactorialsorting@fintrack-snwv2.mongodb.net/test?retryWrites=true&w=majority'

const app = express()
const client = new MongoClient(url, { useNewUrlParser: true })
client.connect(err => {
  const collection = client.db('test').collection('devices')
  console.log('connected')
  client.close()
  console.log('close')
})
