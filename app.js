const express = require("express");
const path = require("path");
const ejs = require("ejs");
const methodOverride = require('method-override');
const mongoose = require("mongoose");
const Campground = require("./models/campground.js");

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true })); //* To access the post request attribute (resources)

//* Only method in HTML is POST, to handle delete method in REST we need to override, we do that using method-override module
app.use(methodOverride('_method')); //* the arguement "_method" will be used to override the method, check edit.ejs 

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
app.get('/campground/:id', async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render('campground/show', { campground });
});

//? View the EDIT page of individual campground
app.get('/campground/:id/edit', async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render('campground/edit', { campground });
});

//? Handle POST request to ADD new Campground  
app.post('/campground/new', async (req, res) => {
  const newCampground = Campground({ ...req.body.campground });
  await newCampground.save();
  res.redirect('/campground')
});

//? Handle PUT request Edit the specific campground (with id)
app.put('/campground/:id', async (req, res) => {
  const { title, location } = req.body.campground; //*title and location is grouped under {campground: {title: "blah", location: "blah"}}
  const { id } = req.params; //* to get ":id" value, we fetch it from URL parameters
  const editedCampground = await Campground.findByIdAndUpdate(req.params.id, { title: title, location: location });
  editedCampground.save();
  res.redirect(`/campground/${id}`);
});

//? Delete a specific Campground 
app.delete('/campground/:id', async (req, res) => {
  await Campground.findByIdAndDelete(req.params.id);
  res.redirect('/campground');
})
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
