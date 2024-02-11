const express = require('express');
const catchAsync = require('../utils/catchAsync');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');

router.get('/register', (req, res) => {
  res.render('users/register');
})
router.post('/register', catchAsync(async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, err => {
      if (err) return next(err);
      req.flash('success', `Welcome to Campture ${username} !!`);
      res.redirect('/campground');
    }); //* after registering the user must be logged in automatically
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/register');
  }
}));

router.get('/login', (req, res) => {
  res.render('users/login');
})

/* *
* About the middleware -> 
? we are authenticating using local strategy.
? in case of failure flash a message, and redirect to the specified route 
*/

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
  req.flash('success', `Welcome back ${req.body.username}`);
  const redirectUrl = req.session.returnTo || '/campground'; // Retrieve the return URL from session
  delete req.session.returnTo; // Clear the return URL from session
  res.redirect(redirectUrl);
});

router.get('/logout', (req, res) => {
  req.logout(() => { }); //* passport method
  req.flash('success', `Goodbye! `);
  res.redirect('/login');
});

module.exports = router;


