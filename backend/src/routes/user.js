const User = require("../models/user-model")
const express = require("express")
const router = express.Router();

router.get("/getusers", (req, res) => {
  User
    .find()
    .then(users => users.map(user => {
      const _id = user._id
      const username = user.username
      const symbols = user.symbols
      return {
        _id,
        username,
        symbols,
      }
    }))
    .then(users => {
      res.status(200).json({
        message: "list of all users",
        users,
      })
    })
    .catch(err => {
      res.sendStatus(500)
    })
})

router.get("/getuser", (req, res) => {
  const username = req.query.username
  if (username) {
    User
      .findOne({ username })
      .then(user => {
        const _id = user._id
        const username = user.username
        const symbols = user.symbols
        res.status(200).json({
          message: `getting user by username: ${username}`,
          user: {
            _id,
            username,
            symbols,
          },
        })
      })
      .catch(err => res.sendStatus(500))
  }
  else {
    User
      .find()
      .then(users => users.map(user => {
        const _id = user._id
        const username = user.username
        const symbols = user.symbols
        return {
          _id,
          username,
          symbols,
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

module.exports = router
