const jwt = require('jsonwebtoken')

module.exports = {
    secret: "im_batman",
    signJWT: function(payload, secret) {
      return new Promise((resolve, reject) => {
        jwt.sign(payload, secret, (err, token) => {
          if (err) {
            reject(err)
          }
          resolve(token)
        })
      })
    },
    queryJWT: function(req, res, next) {
      const bearerHeader = req.headers['authorization']
      if (bearerHeader) {
        bearerToken = bearerHeader.split(' ')[1]
        req.token = bearerToken
        next()
      } else {
        res.sendStatus(403)
      }
    },
    verifyJWT: function(token, secret) {
      return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, auth) => {
          if (err) {
            reject(err)
          }
          resolve(auth)
        })
      })
    }
}
