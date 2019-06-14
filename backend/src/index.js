const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const userRoute = require('./routes/userRoute')

const PORT = process.env.PORT || 3000

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use('/user', userRoute)

app.use((req, res, next) => {
  console.log(`${new Date().toString()} => ${req.originalUrl}`)
  next()
})

app.use((req, res, next) => {
  res.status(404).send('error 404, Resource Not Found')
})

app.use((err, req, res, next) => {
  console.log(err.stack)
  res.status(500).send('error 500')
})

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})