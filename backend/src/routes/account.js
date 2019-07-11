const User = require('../models/user-model')
const Blacklist = require('../models/blacklist-model')
const bcrypt = require('../util/bcrypt')
const jwt = require('../util/jwt')
const express = require('express')
const router = express.Router()

router.post('/deleteaccount', (req, res) => {
  const _id = req.body._id
  const supplied_password = req.body.password
  User
    .findById(_id)
    .then(user => {
      if (!user) {
        res.sendStatus(404)
      } else {
        bcrypt
          .checkPassword(supplied_password, user.password)
          .then(isValid => {
            if (isValid) {
              User
                .findByIdAndDelete(_id)
                .then(user => {
                  const _id = user._id
                  const username = user.username
                  res.status(200).json({
                    message: `removed ${user.username} from database`,
                    user: {
                      _id,
                      username,
                    },
                  })
                })
            } else {
              res.sendStatus(403)
            }
          })
          .catch(err => res.sendStatus(500))
      }
    })
    .catch(err => res.sendStatus(500))
})

router.post('/logout', (req, res) => {
  const _id = req.body._id
  const accesstoken = req.accesstoken
  const refreshtoken = req.refreshtoken
  const addBlacklist = (userid, token) => {
    const exp = jwt.payload_JWT(token).exp
    const expireAt = new Date(exp * 1000)
    const blacklist = new Blacklist({
      userid,
      token,
      expireAt,
    })
    return blacklist
      .save()
      .catch(err => res.sendStatus(500))
  }
  Promise
    .all([addBlacklist(_id, accesstoken), addBlacklist(_id, refreshtoken)])
    .then(done => res.status(200).json({ message: `logged out` }))
    .catch(err => res.sendStatus(500))
})

module.exports = router
