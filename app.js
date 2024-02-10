const express = require("express");
const path = require("path");
const ejs = require("ejs");
const ejsMate = require("ejs-mate");
const methodOverride = require('method-override');
const mongoose = require("mongoose");
const Campground = require("./models/campground.js");
const Review = require("./models/review.js");
const Joi = require("joi");
const { campgroundSchema, reviewSchema } = require("./schema.js")
const catchAsync = require("./utils/catchAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true })); //* To access the post request attribute (resources)
app.engine('ejs', ejsMate);

//* Only method in HTML is POST, to handle delete method in REST we need to override, we do that using method-override module
app.use(methodOverride('_method')); //* the arguement "_method" will be used to override the method, check edit.ejs 
//* Middlew are
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

//*? Show all the campgrounds in the DB
app.get('/campground', async (req, res) => {
  const campgrounds = await Campground.find({}); //* find all [as there is no condition on filtering]
  res.render('campground/index', { campgrounds }); //* campgrounds is array of javascript objects
});

//? Add a new Campground 
app.get('/campground/new', async (req, res) => {
  res.render('campground/new');
});

//? View individual campground
app.get('/campground/:id', catchAsync(async (req, res) => {
  //* Potential error - searching for wrong id
  const campground = await Campground.findById(req.params.id).populate('reviews');
  console.log(campground);
  console.log("^campground^");
  res.render('campground/show', { campground });
}));

//? View the EDIT page of individual campground
app.get('/campground/:id/edit', catchAsync(async (req, res) => {
  //* Potential error - trying to get the edit page of campground that doesnt exist
  const campground = await Campground.findById(req.params.id);
  res.render('campground/edit', { campground });
}));

//? Handle POST request to ADD new Campground  
app.post('/campground', validateCampground, catchAsync(async (req, res, next) => {
  //* CatchAsync is will catch errors is there are any from mongoose. like price = $abc 
  const newCampground = Campground({ ...req.body.campground });
  await newCampground.save();
  res.redirect('/campground')
}));

app.post('/campground/:id/reviews', validateReview, async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  console.log(`redirecting -> /campground/${req.params.id}`);
  res.redirect(`/campground/${req.params.id}`);
});

//? Handle PUT request Edit the specific campground (with id)
app.put('/campground/:id', validateCampground, catchAsync(async (req, res) => {
  //* Potential error - trying to edit page of campground that doesnt exist.
  const editedValue = req.body.campground; //* Title and location is grouped under {campground: {title: "blah", location: "blah"}}
  const { id } = req.params; //* To get ":id" value, we fetch it from URL parameters
  const editedCampground = await Campground.findByIdAndUpdate(req.params.id, editedValue);
  editedCampground.save();
  res.redirect(`/campground/${id}`);
}));

//? Delete a specific Campground 
app.delete('/campground/:id', catchAsync(async (req, res) => {
  await Campground.findByIdAndDelete(req.params.id);
  res.redirect('/campground');
}));

app.delete('/campground/:id/reviews/:reviewid', catchAsync(async (req, res) => {
  const { id, reviewid } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
  await Review.findByIdAndDelete(reviewid);
  res.redirect(`/campground/${id}`);
}))

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
  console.log(`Server is running on http://localhost:${PORT}`);
});
