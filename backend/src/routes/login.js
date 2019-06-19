const User = require("../models/UserModel");
const express = require("express");
const bcrypt = require("../util/bcrypt");
const jwt = require("../util/jwt");
const router = express.Router();

router.post("/login", (req, res) => {
  const supplied_username = req.body.username.toLowerCase();
  const supplied_password = req.body.password;
  User.findOne({ username: supplied_username }).then(user => {
    if (!user) {
      return res.status(404).json({
        request: req.url,
        message: "error",
        error: "User account does not exist"
      });
    }
    return bcrypt
      .checkPassword(supplied_password, user.password)
      .then(isValid => {
        if (isValid) {
          jwt
            .signJWT({ user })
            .then(token => res.json({ token }))
            .catch(err =>
              res.status(500).json({
                request: req.url,
                message: "Error",
                error: err
              })
            );
        } else {
          res.status(400).json({
            request: req.url,
            message: "error",
            error: "Invalid password"
          });
        }
      });
  });
});

module.exports = router;
