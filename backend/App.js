const Express = require('express')
const BodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID

const PORT = 3000
const url = 'mongodb+srv://fintrack:nfactorialsorting@fintrack-snwv2.mongodb.net/test?retryWrites=true&w=majority'

const app = Express()
app.use(BodyParser.json())
app.use(BodyParser.urlencoded({ extended: true }))

app.listen(PORT, () => {
  console.log('listening')
  const client = new MongoClient(url, { useNewUrlParser: true })
  client.connect(err => {
    if (err) {
      console.log(err)
    }
    console.log('mongoclient')
    const collection = client.db('test').collection('devices')
    console.log(collection)
    client.close()
  })
})