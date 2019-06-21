const User = require("../models/UserModel");
const express = require("express");
const bcrypt = require("../util/bcrypt");
const router = express.Router();

router.post("/register", (req, res) => {
  const displayUsername = req.body.username;
  const username = displayUsername;
  const email = req.body.email;
  const plaintext_password = req.body.password;

  bcrypt
    .hash(plaintext_password)
    .then(hash => {
      const user = new User({
        displayUsername: displayUsername,
        username: username,
        email: email,
        password: hash
      });
      user
        .save()
        .then(doc => {
          res.status(200).json({
            request: `${req.url}`,
            message: "added user",
            user: doc
          });
        })
        .catch(err => {
          res.status(500).json({
            request: `${req.url}`,
            message: "error",
            error: err
          });
        });
    })
    .catch(err =>
      res.json({
        request: req.url,
        message: "error",
        error: err
      })
    );
});

module.exports = router;
