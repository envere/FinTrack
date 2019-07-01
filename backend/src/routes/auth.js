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
        password: hash,
        symbols: [],
      });
      user
        .save()
        .then(doc => {
          res.status(201).json({
            message: `added ${username}`,
            user: doc
          });
        })
        .catch(err => res.sendStatus(400))
    })
    .catch(err => res.sendStatus(400))
});

router.post("/login", (req, res) => {
  const supplied_username = req.body.username.toLowerCase();
  const supplied_password = req.body.password;
  User
    .findOne({ username: supplied_username })
    .then(user => {
      if (!user) {
        res.sendStatus(404)
      } else {
        bcrypt
          .checkPassword(supplied_password, user.password)
          .then(isValid => {
            if (isValid) {
              jwt
                .signJWT({ user })
                .then(token => res.json({
                  message: 'authentication passed',
                  token,
                  user,
                }))
                .catch(err => res.sendStatus(400))
            } else {
              res.sendStatus(403)
            }
          })
          .catch(err => res.sendStatus(400))
      }
    })
    .catch(err => res.sendStatus(400))
});

module.exports = router;
