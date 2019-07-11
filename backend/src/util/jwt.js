const Blacklist = require('../models/blacklist-model')
const jwt = require('jsonwebtoken')
const jwtConfig = require('../configs/jwt-config')
const access_secret = jwtConfig.access_secret
const refresh_secret = jwtConfig.refresh_secret

function payload_JWT(token) {
  return jwt.decode(token)
}

function sign_access_JWT(payload, options) {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, access_secret, options, (err, token) => {
      if (err) {
        reject(err)
      }
      resolve(token)
    })
  })
}

function query_access_JWT(req, res, next) {
  const bearerHeader = req.headers['authorization']
  if (bearerHeader) {
    bearerToken = bearerHeader.split(' ')[1]
    req.accesstoken = bearerToken
    next()
  } else {
    res.sendStatus(403)
  }
}

function check_blacklist_access_jwt(req, res, next) {
  const userid = req.body.id
  const token = req.accesstoken
  Blacklist
    .findOne({ userid, token })
    .then(blacklist => {
      if (blacklist) {
        res.sendStatus(403)
      } else {
        next()
      }
    })
    .catch(err => res.sendStatus(500))
}

function verify_access_JWT(req, res, next) {
  jwt.verify(req.accesstoken, access_secret, (err, auth) => {
    if (err) {
      res.sendStatus(401)
    } else {
      next()
    }
  })
}

function authenticate_access_JWT() {
  return [
    query_access_JWT,
    check_blacklist_access_jwt,
    verify_access_JWT,
  ]
}

function sign_refresh_JWT(payload, options) {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, refresh_secret, options, (err, token) => {
      if (err) {
        reject(err)
      }
      resolve(token)
    })
  })
}

function query_refresh_JWT(req, res, next) {
  const bearerHeader = req.headers['authorization']
  if (bearerHeader) {
    bearerToken = bearerHeader.split(' ')[1]
    req.refreshtoken = bearerToken
    next()
  } else {
    res.sendStatus(403)
  }
}

function check_blacklist_refresh_JWT(req, res, next) {
  const userid = req.body.id
  const token = req.refreshtoken
  Blacklist
    .findOne({ token, userid })
    .then(blacklist => {
      if (blacklist) {
        res.sendStatus(403)
      } else {
        next()
      }
    })
    .catch(err => res.sendStatus(500))
}

function verify_refresh_JWT(req, res, next) {
  jwt.verify(req.refreshtoken, refresh_secret, (err, auth) => {
    if (err) {
      res.sendStatus(403)
    } else {
      next()
    }
  })
}

function authenticate_refresh_JWT() {
  return [
    query_refresh_JWT,
    check_blacklist_refresh_JWT,
    verify_refresh_JWT
  ]
}

module.exports = {
  payload_JWT,
  sign_access_JWT,
  authenticate_access_JWT,
  sign_refresh_JWT,
  authenticate_refresh_JWT,
}