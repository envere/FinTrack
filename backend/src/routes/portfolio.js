const Portfolio = require('../models/portfolio-model')
const express = require('express')
const router = express.Router()

router.get('/get', (req, res) => {
  const userid = req.body.userid
  Portfolio
    .findOne({ userid })
    .then(portfolio => {
      if (portfolio) {
        res.status(200).json({
          message: `getting portfolio of ${userid}`,
          portfolio,
        })
      } else {
        res.sendStatus(404)
      }
    })
    .catch(err => res.sendStatus(500))
})

module.exports = router