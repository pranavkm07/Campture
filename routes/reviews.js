const express = require('express');
const router = express.Router({ mergeParams: true }); //* all of the prefixed params will be accessible 
const catchAsync = require("../utils/catchAsync.js");
const Campground = require("../models/campground.js");
const Review = require("../models/review.js");
const reviews = require('../controllers/reviews.js');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware.js');

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewid', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;