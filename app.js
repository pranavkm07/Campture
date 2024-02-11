const express = require("express");
const path = require("path");
const ejs = require("ejs");
const ejsMate = require("ejs-mate");
const methodOverride = require('method-override');
const mongoose = require("mongoose");
const Joi = require("joi");
const ExpressError = require("./utils/ExpressError.js");
const sessions = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');

const campgroundRoutes = require('./routes/campgrounds.js');
const reviewRoutes = require('./routes/reviews.js');
const userRoutes = require('./routes/users.js');


const app = express();
const PORT = 3000;

 
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true })); //* To access the post request attribute (resources)
app.use(express.static(path.join(__dirname, 'public')));
app.engine('ejs', ejsMate);

const sessionsConfig = {
  secret: 'thisismysecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true, //* security concerns - only https requests are allowed
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //* exprires in 1 week from now.
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}
app.use(sessions(sessionsConfig)); //* should be placed before passport.session()
app.use(flash()); //* for flash messages

app.use(passport.initialize()); //* for persistent user login
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())) 
//* Defines ways to let a user in and log them out
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/*
 ? Methods like 
 ? 1. authenticate  
 ? 2. serialise - log in
 ? 3. deserialise - log out
 ? 4. register - checks if username is unique and register with the password
 ? are pre-defined in LocalStrategy
 */
app.use((req, res, next) => {
  res.locals.currentUser = req.user; //* when a user is serialised the "req.user" will contain all the info
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

//* Only method in HTML is POST, to handle delete method in REST we need to override, we do that using method-override module
app.use(methodOverride('_method')); //* the arguement "_method" will be used to override the method, check edit.ejs 


mongoose.set('strictQuery', true);
//? CAMPTURE is the DB name, "Camgrounds" is model name aka collection.  
mongoose.connect('mongodb://127.0.0.1:27017/campture', { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    console.log('Connection Open');
  })
  .catch(err => {
    console.log('Error Occurred');
    console.log(err);
  });

//*? Landing page - not built yet
app.get('/', async (req, res) => {
  res.render('home');
});

app.use('/', userRoutes);
app.use('/campground', campgroundRoutes);
app.use('/campground/:id/reviews', reviewRoutes);

app.all('*', (req, res, next) => {
  //* If netiher of the methods(get post put delete) or routes match.
  next(new ExpressError('Page not found', 404));
})

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Ohhh Noo! Smtg Went Wrong";
  res.status(statusCode).render('error', { err });
})
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/login`);
});
