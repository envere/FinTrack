const passport_jwt = require('passport-jwt')
const jwtStrategy = passport_jwt.Strategy
const ExtractJwt = passport_jwt.ExtractJwt

const mongoose = require('mongoose')
const User = require('../models/UserModel')

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'secret',
}

module.exports = passport => {
  passport.use(
    new jwtStrategy(options, (payload, done) => {
      User
        .find({username: payload.id})
        .then(user => {
          return user
            ? done(null, user)
            : done(null, false)
        })
        .catch(err => console.log(err))
    })
  )
}