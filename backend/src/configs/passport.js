import jwtSecret from './jwtConfig'
import bcrypt from 'bcrypt'

const saltRounds = 12

const passport = require('passport')
const passport_local = require('passport-local')
const passport_jwt = require('passport-jwt')

const localStrategy = passport_local.Strategy
const jwtStrategy = passport_jwt.Strategy
const ExtractJWT = passport_jwt.ExtractJWT

const User = require('../models/UserModel')

passport.use(
  'login',
  new localStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      session: false,
    },
    (username, password, done) => {
      User
        .findOne({username: username})
        .then(user => {
          if (!user) {
            return done(null, false, { message: 'username not found' })
          } else {
            bcrypt
              .compare(password, user.password)
              .then(isValid => {
                return isValid
                  ? done(null, user)
                  : done(null, false, { message: 'invalid password' })
              })
          }
        })
        .catch(err => done(err))
    }
  )
)

passport.use(
  'jwt',
  new jwtStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('JWT'),
      secretOrKey: jwtSecret.secret,
    },
    (jwt_payload, done) => {
      User
        .findOne({username: jwt_payload.id})
        .then(user => {
          if (user) {
            done(null, user)
          } else {
            done(null, false, { message: 'user not found' })
          }
        })
        .catch(err => done(err))
    }
  )
)