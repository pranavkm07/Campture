const { campgroundSchema, reviewSchema } = require("./schema.js"); //* JOI schemas
const ExpressError = require("./utils/ExpressError.js");
const Campground = require("./models/campground.js");
const Review = require("./models/review.js");


module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) { //* 'isAuthenticated()' method is plugged in by passport to "req" param
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'You have not signed in');
    res.redirect('/login');
    return;
  }
  next();
}

//* Middleware
module.exports.validateCampground = (req, res, next) => {
  //! These server-side validations can be tested from ThunderClient/Postman 
  const { error } = campgroundSchema.validate(req.body); //* result after validating
  if (error) {
    const errorMessage = error.details.map(element => element.message).join(','); //* error message needs to be concatinated if there is more than 1 error
    throw new ExpressError(errorMessage, 400);
  } else {
    next();
  }
}

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) { //* if logged in user is same as author of the campground
    req.flash('error', 'You do not have permission to do that.');
    return res.redirect(`/campground/${id}`);
  }
  next();
}
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewid } = req.params;
  const review = await Review.findById(reviewid);
  if (!review.author.equals(req.user._id)) { //* if logged in user is same as author of the campground
    req.flash('error', 'You do not have permission to do that.');
    return res.redirect(`/campground/${id}`);
  }
  next();
}


module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    console.log(error);
    console.log("error in review");
    const errorMessage = error.details.map(element => element.message).join(','); //* error message needs to be concatinated if there is more than 1 error
    throw new ExpressError(errorMessage, 400);
  } else {
    next();
  }
}
