const User = require("../models/UserModel");
const jwt = require("../util/jwt");
const express = require("express");
const router = express.Router();

router.get("/getusers", (req, res) => {
  jwt
    .verifyJWT(req.token)
    .then(auth => {
      User
        .find()
        .then(users => users.map(user => {
          return {
            _id: user._id,
            username: user.username,
            symbols: user.symbols,
          }
        }))
        .then(users => {
          res.status(200).json({
            message: "list of all users",
            users,
          });
        })
        .catch(err => {
          res.sendStatus(500)
        });
    })
    .catch(err => res.sendStatus(403));
});

router.get("/getuser", (req, res) => {
  jwt
    .verifyJWT(req.token)
    .then(auth => {
      const username = req.query.username
      if (username) {
        User
          .findOne({ username })
          .then(user => {
            res.status(200).json({
              message: `getting user by username: ${username}`,
              user: {
                _id: user._id,
                username: user.username,
                symbols: user.symbols,
              },
            })
          })
          .catch(err => res.sendStatus(500))
      }
      else {
        User
          .find()
          .then(users => users.map(user => {
            return {
              _id: user._id,
              username: user.username,
              symbols: user.symbols,
            }
          }))
          .then(users => {
            res.status(200).json({
              message: 'fetching all users since no username in query',
              users,
            })
          })
          .catch(err => res.sendStatus(500))
      }
    })
    .catch(err => res.sendStatus(403));
});

module.exports = router;
