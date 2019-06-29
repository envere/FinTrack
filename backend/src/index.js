const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("./util/jwt");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/auth", require("./routes/auth"))
app.use("/account", jwt.queryJWT, require("./routes/account"))
app.use("/user", jwt.queryJWT, require("./routes/user"));
app.use("/stock", jwt.queryJWT, require("./routes/stock"));

app.use((req, res, next) => {
  console.log(`${new Date().toString()} => ${req.originalUrl}`);
  next();
});

app.use((req, res, next) => {
  res.status(404).send("error 404, Resource Not Found");
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send("error 500");
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
