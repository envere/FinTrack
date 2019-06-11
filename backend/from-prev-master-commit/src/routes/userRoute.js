const UserModel = require('../models/userModel')
const express = require('express')
const router = express.Router()

// create new user
// POST
router.post('/user', (req, res) => {
  if (!req.body) {
    res.status(400).send('error 400, Request boy missing')
  }

  if (!req.body.email) {

  }

  const model = new UserModel(req.body)
  model
    .save()
    .then(doc => {
      if (!doc || doc.length === 0) {
        return res.status(500).send(doc)
      }

      res.status(201).send(doc)
    })
    .catch(err => {
      res.status(500).json(err)
    })
})

// GET
router.get('/user', (req, res) => {
  if (!res.query.email) {
    return res.status(400).send('missing url parameter: email')
  }

  UserModel
    .findOne({email: req.query.email})
    .then(doc => {res.json(doc)})
    .catch(err => {res.status(500).json(err)})
})

// UPDATE
router.put('/user', (req, res) => {
  if (!req.query.email) {
    return res.status(400).send('missing url parameter: email')
  }

  UserModel
    .findOneAndUpdate({email: req.query.email}, req.body, {new: true})
    .then(doc => {res.json(doc)})
    .catch(err => {res.status(500).json(err)})
})

// DELETE
router.delete('/user', (req, res) => {
  if (!req.query.email) {
    return res.status(400).send('missing url parameter: email')
  }

  UserModel
    .findOneAndRemove({email: req.query.email})
    .then(doc => {res.json(doc)})
    .catch(err => {res.status(500).json(err)})
})

module.exports = router