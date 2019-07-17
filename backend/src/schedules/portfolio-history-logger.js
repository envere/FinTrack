const PortfolioHistory = require('../models/portfolio-history-model')
const User = require('../models/user-model')

function getUserIds() {
  return User
    .find()
    .then(users => users.map(user => user._id))
}

getUserIds()
  .then(x => console.log(x))
  .catch(err => console.log(err))