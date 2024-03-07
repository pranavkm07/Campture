const Campground = require("../models/campground.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});
const {cloudinary} = require('../cloudinary');

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({}); //* find all [as there is no condition on filtering]
  res.render('campground/index', { campgrounds }); //* campgrounds is array of javascript objects
}
module.exports.renderNewForm = async (req, res) => {
  res.render('campground/new');
}

module.exports.showCampground = async (req, res) => {
  //* Potential error - searching for wrong id
  const campground = await Campground.findById(req.params.id).populate({
    path: 'reviews', //* populate review first
    populate: {
      path: 'author' //? furthur populate the authors in each review
    }
  }).populate('author');
  if (!campground) { //! If campground is not found. 
    req.flash('error', 'Cannot find the campground');
    return res.redirect('/campground');
  }
  res.render('campground/show', { campground });
}

module.exports.createCampground = async (req, res, next) => {
  //* CatchAsync is will catch errors is there are any from mongoose. like price = $abc 
  //?req.files is all the images 
  const geoData = await geocoder.forwardGeocode({
    query: req.body.campground.location,
    limit: 1
  }).send()
  const newCampground = Campground({ ...req.body.campground });
  newCampground.geometry = geoData.body.features[0].geometry;
  newCampground.author = req.user._id;
  newCampground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
  await newCampground.save();
  console.log("NEw Campground added: \n");
  console.log(newCampground);
  req.flash('success', 'Successfully made a new campground');
  res.redirect('/campground')
}

module.exports.renderEditForm = async (req, res) => {
  //* Potential error - trying to get the edit page of campground that doesnt exist
  const campground = await Campground.findById(req.params.id);
  res.render('campground/edit', { campground });
}

module.exports.updatedCampground = async (req, res) => {
  
  //* Potential error - trying to edit page of campground that doesnt exist.
  const editedValue = req.body.campground; //* Title and location is grouped under {campground: {title: "blah", location: "blah"}}
  const { id } = req.params; //* To get ":id" value, we fetch it from URL parameters
  const editedCampground = await Campground.findByIdAndUpdate(req.params.id, editedValue);
  const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
  editedCampground.images.push(...imgs);

  //* remove the images from cloudinary and mongoDB images array
  if(req.body.deleteImages){
    //* Cloudinary
    for(let filename of req.body.deleteImages){
      await cloudinary.uploader.destroy(filename);
    }        
    //* MongoDB
    await editedCampground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
  }

  editedCampground.save();
  req.flash('success', 'Successfully updated the campground');
  res.redirect(`/campground/${id}`);
}

module.exports.deleteCampground = async (req, res) => {
  await Campground.findByIdAndDelete(req.params.id);
  req.flash('success', 'Successfully deleted the campground');
  res.redirect('/campground');
}