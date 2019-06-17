const passport = require('passport')
const passportLocal = require('passport-local')
const passportJWT = require('passport-jwt')
const LocalStrategy = passportLocal.Strategy
const JWTStrategy = passportJWT.Strategy

const User = require('./models/UserModel')

const localStrategy = new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password',
  },
  (username, password, callback) => {
    return User
      .findOne({username, password})
      .then(user => {
        return user
          ? callback(null, user, { message: 'successful login' })
          : callback(null, user, { message: 'incorrect username OR password' })
      })
      .catch(err => {
        console.log(err)
        callback(err)
      })
  }
)

const jwtStrategy = new JWTStrategy(
  {
  jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'secret_jwt',
  },
  (jwtPayload, callback) => {
    return User
      .findOne({})
  }
)

passport.use(localStrategy)