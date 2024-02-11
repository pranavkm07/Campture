const express = require('express');
const catchAsync = require('../utils/catchAsync');
const router = express.Router();
const User = require('../models/user');
const users = require('../controllers/users');
const passport = require('passport');


router.route('/register')
  .get(users.renderRegister)
  .post(catchAsync(users.registerUser));

/* *
* About the middleware -> 
? we are authenticating using local strategy.
? in case of failure flash a message, and redirect to the specified route 
*/
router.route('/login')
  .get(users.renderLogin)
  .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.loginUser);

router.get('/logout', users.logoutUser);

module.exports = router;


