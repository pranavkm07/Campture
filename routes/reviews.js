const express = require('express');
const router = express.Router({ mergeParams: true }); //* all of the prefixed params will be accessible 
const catchAsync = require("../utils/catchAsync.js");
const Campground = require("../models/campground.js");
const Review = require("../models/review.js");

const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware.js');

router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id; //* adding the current user as the author to this review
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  res.redirect(`/campground/${req.params.id}`);
}));

router.delete('/:reviewid', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
  const { id, reviewid } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
  await Review.findByIdAndDelete(reviewid);
  res.redirect(`/campground/${id}`);
}));

module.exports = router;