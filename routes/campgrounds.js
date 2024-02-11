const express = require('express');
const router = express.Router();
const Campground = require("../models/campground.js");
const catchAsync = require("../utils/catchAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const { campgroundSchema } = require("../schema.js")

//* Middleware
const validateCampground = (req, res, next) => {
  //! These server-side validations can be tested from ThunderClient/Postman 
  const { error } = campgroundSchema.validate(req.body); //* result after validating
  if (error) {
    const errorMessage = error.details.map(element => element.message).join(','); //* error message needs to be concatinated if there is more than 1 error
    throw new ExpressError(errorMessage, 400);
  } else {
    next();
  }
}

//*? Show all the campgrounds in the DB
router.get('/', async (req, res) => {
  const campgrounds = await Campground.find({}); //* find all [as there is no condition on filtering]
  res.render('campground/index', { campgrounds }); //* campgrounds is array of javascript objects
});

//? Add a new Campground 
router.get('/new', async (req, res) => {
  res.render('campground/new');
});

//? View individual campground
router.get('/:id', catchAsync(async (req, res) => {
  //* Potential error - searching for wrong id
  const campground = await Campground.findById(req.params.id).populate('reviews');
  if(!campground){ //! If campground is not found. 
    req.flash('error', 'Cannot find the campground');
    return res.redirect('/campground');
  }
  res.render('campground/show', { campground });
}));

//? View the EDIT page of individual campground
router.get('/:id/edit', catchAsync(async (req, res) => {
  //* Potential error - trying to get the edit page of campground that doesnt exist
  const campground = await Campground.findById(req.params.id);
  res.render('campground/edit', { campground });
}));

//? Handle POST request to ADD new Campground  
router.post('/', validateCampground, catchAsync(async (req, res, next) => {
  //* CatchAsync is will catch errors is there are any from mongoose. like price = $abc 
  const newCampground = Campground({ ...req.body.campground });
  await newCampground.save();
  req.flash('success', 'Successfully made a new campground');
  res.redirect('/campground')
}));

//? Handle PUT request Edit the specific campground (with id)
router.put('/:id', validateCampground, catchAsync(async (req, res) => {
  //* Potential error - trying to edit page of campground that doesnt exist.
  const editedValue = req.body.campground; //* Title and location is grouped under {campground: {title: "blah", location: "blah"}}
  const { id } = req.params; //* To get ":id" value, we fetch it from URL parameters
  const editedCampground = await Campground.findByIdAndUpdate(req.params.id, editedValue);
  editedCampground.save();
  req.flash('success', 'Successfully updated the campground');
  res.redirect(`/campground/${id}`);
}));

//? Delete a specific Campground 
router.delete('/:id', catchAsync(async (req, res) => {
  await Campground.findByIdAndDelete(req.params.id);
  req.flash('success', 'Successfully deleted the campground');
  res.redirect('/campground');
}));

module.exports = router;