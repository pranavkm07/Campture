const express = require('express');
const router = express.Router();
const catchAsync = require("../utils/catchAsync.js");
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware.js');
const campgrounds = require('../controllers/campgrounds.js')
const { storage } = require('../cloudinary');
//* Multipart Form data - for handling images
const multer = require('multer');
const upload = multer({ storage });
//* Same route, but different verbs

//* home route ✅✅
router.route('/')
  .get(campgrounds.index) //*? Show all the campgrounds in the DB✅
  //! upload should be before validate
  .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground)); //? Handle POST request to ADD new Campground ✅
   //? upload.array will contain multiple images
  

//? Add a new Campground ✅
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

//* /:id route ✅✅
router.route('/:id')
  .get(catchAsync(campgrounds.showCampground)) //? View individual campground ✅
  //! upload should be before validate
  .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updatedCampground))  //? Handle PUT request Edit the specific campground (with id) ✅
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));  //? Delete a specific Campground ✅

//? View the EDIT page of individual campground ✅
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));


module.exports = router;