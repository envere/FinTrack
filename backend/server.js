const express = require('express')
const MongoClient = require('mongodb').MongoClient
const bodyParser = require('body-parser')

const app = express()

const port = 8000

app.listen(port, () => {
    console.log('listening')
})


// set up CRUD => Create, Read, Update, Delete