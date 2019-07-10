const express = require("express")
const bodyParser = require("body-parser")
const authenticate_access_JWT = require("./util/jwt").authenticate_access_JWT

const PORT = process.env.PORT || 3000

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use((req, res, next) => {
  console.log(`${new Date().toString()} => ${req.originalUrl}`)
  next()
})

app.use("/auth", require("./routes/auth"))
app.use("/account", authenticate_access_JWT(),require("./routes/account"))
app.use("/user", authenticate_access_JWT(), require("./routes/user"))
app.use("/stock", authenticate_access_JWT(), require("./routes/stock"))
app.use("/dividend", authenticate_access_JWT(), require("./routes/dividend"))

app.use((req, res, next) => {
  res.status(404).send("error 404, Resource Not Found")
})

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send("error 500")
})

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})
