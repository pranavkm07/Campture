const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
  res.render('users/register');
}

module.exports.renderLogin = (req, res) => {
  res.render('users/login');
}

module.exports.registerUser = async (req, res, next) => {
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
}

module.exports.loginUser = (req, res) => {
  req.flash('success', `Welcome back ${req.body.username}`);
  const redirectUrl = req.session.returnTo || '/campground'; // Retrieve the return URL from session
  delete req.session.returnTo; // Clear the return URL from session
  res.redirect(redirectUrl);
}

module.exports.logoutUser = (req, res) => {
  req.logout(() => { }); //* passport method
  req.flash('success', `Goodbye!`);
  res.redirect('/login');
}