const Campground = require("../models/campground.js");
const Review = require("../models/review.js");

module.exports.createReview = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id; //* adding the current user as the author to this review
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  res.redirect(`/campground/${req.params.id}`);
}

module.exports.deleteReview = async (req, res) => {
  const { id, reviewid } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
  await Review.findByIdAndDelete(reviewid);
  res.redirect(`/campground/${id}`);
}