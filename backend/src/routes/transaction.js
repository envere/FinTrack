const Transaction = require('../models/transaction-model')
const express = require('express')
const router = express.Router()

router.get('/get', (req, res) => {
  const userid = req.body.userid
  Transaction
    .findOne({ userid })
    .then(transaction => res.status(200).json({
      message: `getting transactions from ${userid}`,
      transaction,
    }))
    .catch(err => res.sendStatus(500))
})

router.post('/add', (req, res) => {
  const userid = req.body.userid
  const ISOdate = req.body.date
  const date = new Date(ISOdate)
  const category = req.body.category
  const symbol = req.body.symbol
  const units = req.body.units
  const price = req.body.price
  const tradeValue = req.body.tradeValue

  const transactionHistory = {
    category,
    date,
    symbol,
    units,
    price,
    tradeValue,
  }

  Transaction
    .findOne({ userid })
    .then(transaction => {
      if (transaction) {
        return Transaction
          .findOneAndUpdate(
            { userid },
            { $push: { history: transactionHistory } }
          )
      } else {
        const history = [transactionHistory]
        const transaction = new Transaction({
          userid,
          history,
        })
        return transaction.save()
      }
    })
    .then(transaction => Transaction.findOne({ userid }))
    .then(transaction => res.status(200).json({
      message: `added transaction`,
      transaction,
    }))
    .catch(err => res.sendStatus(500))
})

router.post('/delete', (req, res) => {
  const userid = req.body.userid
  const _id = req.body.transactionid

  Transaction
    .findOne({ userid })
    .then(transaction => {
      if (transaction) {
        Transaction
          .findOneAndUpdate(
            { userid },
            { $pull: { history: { _id } } }
          )
          .then(transaction => Transaction.findOne({ userid }))
          .then(transaction => res.status(200).json({
            message: `delete transaction`,
            transaction,
          }))
          .catch(err => res.sendStatus(500))
      } else {
        res.sendStatus(404)
      }
    })
    .catch(err => res.sendStatus(500))
})

router.post('/update', (req, res) => {
  const userid = req.body.userid
  const _id = req.body.transactionid
  const req_category = req.body.category
  const ISOdate = req.body.date
  const req_symbol = req.body.symbol
  const req_units = req.body.units
  const req_price = req.body.price
  const req_tradeValue = req.body.tradeValue

  Transaction
    .findOne({ userid })
    .then(transaction => {
      if (transaction) {
        const history = transaction.history
        const elem = history.find(elem => elem._id.toString() === _id)
        elem.category = (req_category === undefined) ? elem.category : req_category
        elem.date = (ISOdate === undefined) ? elem.date : new Date(ISOdate)
        elem.symbol = (req_symbol === undefined) ? elem.symbol : req_symbol
        elem.units = (req_units === undefined) ? elem.units : req_units
        elem.price = (req_price === undefined) ? elem.price : req_price
        elem.tradeValue = (req_tradeValue === undefined) ? elem.tradeValue : req_tradeValue
        Transaction
          .findOneAndUpdate({ userid }, { history })
          .then(transaction => Transaction.findOne({ userid }))
          .then(transaction => res.status(200).json({
            message: `updated transaction`,
            transaction,
          }))
          .catch(err => res.sendStatus(500))
      } else {
        res.sendStatus(404)
      }
    })
    .catch(err => res.sendStatus(500))
})

module.exports = router