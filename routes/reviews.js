const express = require('express');
const router = express.Router({mergeParams:true}); //* all of the prefixed params will be accessible 
const catchAsync = require("../utils/catchAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Campground = require("../models/campground.js");
const { reviewSchema } = require("../schema.js")
const Review = require("../models/review.js");

const validateReview = (req, res, next) => {
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

router.post('/', validateReview, catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  res.redirect(`/campground/${req.params.id}`);
}));

router.delete('/:reviewid', catchAsync(async (req, res) => {
  const { id, reviewid } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
  await Review.findByIdAndDelete(reviewid);
  res.redirect(`/campground/${id}`);
}));

module.exports = router;