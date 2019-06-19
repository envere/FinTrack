const bcrypt = require('bcrypt')
const saltRounds = require('../configs/bcryptConfig').saltRounds

module.exports = {
  hash: function (plaintext_password) {
    return new Promise((resolve, reject) => {
      bcrypt.hash(plaintext_password, saltRounds, (err, hash) => {
        if (err) {
          reject(err)
        }
        resolve(hash)
      })
    })
  },
  checkPassword: function (supplied_password, hashed_password) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(supplied_password, hashed_password, (err, result) => {
        if (err) {
          reject(err)
        }
        resolve(result)
      })
    
    })
  }
}