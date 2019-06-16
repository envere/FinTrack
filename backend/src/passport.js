const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('./models/UserModel')

const localStrategy = new LocalStrategy({
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

passport.use(localStrategy)