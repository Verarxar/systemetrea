'use strict';
const passport = require('passport');
const express = require('express');
const mongoose = require('mongoose');
const User = mongoose.model('User');

const router = express.Router();

function addTemplateVariables (req, res, next) {
  res.locals.profile = req.user;
  res.locals.login = `/auth/login?return=${encodeURIComponent(req.originalUrl)}`;
  res.locals.logout = `/auth/logout?return=${encodeURIComponent(req.originalUrl)}`;
  next();
}

router.post('/register', (req, res) => {
  console.log('hello!');
  const user = new User();
  user.name = req.body.name;
  user.email = req.body.email;

  user.setPassword(req.body.password);

  user.save(function(err) {
    if (err) {
      console.log('err saving user', err);
      return res.status(500).json(err);
    }
    let token;
    token = user.generateJwt();
    res.status(200);
    res.json({
      "token" : token
    });
  });
});

router.post('/login', (req, res) => {
  passport.authenticate('local', function(err, user, info){
    let token;

    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }

    // If a user is found
    if(user){
      token = user.generateJwt();
      res.status(200);
      res.json({
        "token" : token
      });
    } else {
      // If user is not found
      res.status(401).json(info);
    }
  })(req, res);
});

module.exports = {
  router: router,
  template: addTemplateVariables
};