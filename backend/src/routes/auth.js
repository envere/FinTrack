const User = require("../models/UserModel");
const express = require("express");
const bcrypt = require("../util/bcrypt");
const jwt = require("../util/jwt");
const router = express.Router()

router.post("/register", (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const plaintext_password = req.body.password;

  bcrypt
    .hash(plaintext_password)
    .then(hash => {
      const user = new User({
        username: username,
        email: email,
        password: hash
      });
      user
        .save()
        .then(doc => {
          res.status(200).json({
            message: "added user",
            user: doc
          });
        })
        .catch(err => {
          res.status(500).json({
            message: "error",
            error: err
          });
        });
    })
    .catch(err =>
      res.json({
        message: "error",
        error: err
      })
    );
});

router.post("/login", (req, res) => {
  const supplied_username = req.body.username.toLowerCase();
  const supplied_password = req.body.password;
  User.findOne({ username: supplied_username }).then(user => {
    if (!user) {
      return res.status(404).json({
        message: "error",
        error: "User account does not exist"
      });
    }
    return bcrypt
      .checkPassword(supplied_password, user.password)
      .then(isValid => {
        if (isValid) {
          jwt
            .signJWT({ user })
            .then(token => res.json({ token }))
            .catch(err =>
              res.status(500).json({
                message: "Error",
                error: err
              })
            );
        } else {
          res.status(400).json({
            message: "error",
            error: "Invalid password"
          });
        }
      });
  });
});

module.exports = router;
