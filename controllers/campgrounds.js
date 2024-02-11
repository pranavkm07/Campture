const Campground = require("../models/campground.js");

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
    path : 'reviews', //* populate review first
    populate: {
      path: 'author' //? furthur populate the authors in each review
    }}).populate('author'); 
  if (!campground) { //! If campground is not found. 
    req.flash('error', 'Cannot find the campground');
    return res.redirect('/campground');
  }
  res.render('campground/show', { campground });
}

module.exports.createCampground = async (req, res, next) => {
  //* CatchAsync is will catch errors is there are any from mongoose. like price = $abc 
  const newCampground = Campground({ ...req.body.campground });
  newCampground.author = req.user._id;
  await newCampground.save();
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
  editedCampground.save();
  req.flash('success', 'Successfully updated the campground');
  res.redirect(`/campground/${id}`);
}

module.exports.deleteCampground = async (req, res) => {
  await Campground.findByIdAndDelete(req.params.id);
  req.flash('success', 'Successfully deleted the campground');
  res.redirect('/campground');
}