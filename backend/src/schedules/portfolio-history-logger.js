const PortfolioHistory = require('../models/portfolio-history-model')
const Portfolio = require('../models/portfolio-model')
const User = require('../models/user-model')

function getUserIds() {
  return User
    .find()
    .then(users => users.map(user => user._id))
}

function updateUserPortfolio(userid) {
  const date = new Date()
  const year = date.getFullYear()
  const portfolio = Portfolio.findOne({ userid })
  const checkHistory = PortfolioHistory.findOne({ userid, year })
  Promise
    .all([portfolio, checkHistory])
    .then(data => {
      const portfolio = data[0]
      const history = data[1]
      const totalCapital = portfolio.totalCapital
      const totalValue = portfolio.totalValue
      const realisedProfits = portfolio.realisedProfits
      const obj = { date, totalCapital, totalValue, realisedProfits }
      if (history) {
        return PortfolioHistory.findOneAndUpdate(
          { userid, year },
          { $push: { history: obj } }
        )
      } else {
        const history = []
        const portfoliohistory = new PortfolioHistory({ userid, year, history })
        return portfoliohistory
          .save()
          .then(done => PortfolioHistory.findOneAndUpdate(
            { userid, year },
            { $push: { history: obj } }
          ))
      }
    })
    .then(updated => console.log(`${userid}'s portfolio logged`))
    .catch(err => console.log(err))
}

function updateAllUsers() {
  getUserIds()
    .then(userid => updateUserPortfolio(userid))
    .catch(err => console.log(err))
}

updateAllUsers()
// getUserIds().then(console.log).catch(console.log)