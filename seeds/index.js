const Campground = require("../models/campground.js");
const cities = require("./cities.js");
const { descriptors, places } = require("./seedHelpers.js");

const getRandomValue = (array) => {
  /*
  ? Helper function to get random value from the array
  * Math.random() - generates values from 0 to 0.9999-
  * multiple it with array length - to generate randomIndex from 0 to 0.999*arrayLength
  * floor the value to generate from 0 to arrayLength-1
  * return the array[randomIndex]
  */
  const randomIndex = Math.floor(Math.random() * array.length)
  return (array[randomIndex]);
}

const seedDB = async () => {
  /*
  *Function to delete exsisting data in DB and insert 50 random values
  *title: combination of [descriptors + places] from seedhelpers.js
  *location: [City,State] from cities.js 
  */
  await Campground.deleteMany({});
  let campground; //a document 
  for (let i = 0; i < 50; i++) {
    let location = getRandomValue(cities)
    campground = new Campground({
      title: `${getRandomValue(descriptors)} ${getRandomValue(places)}`,
      location: `${location.city}, ${location.state}`
    })
    console.log(campground.location);
    campground.save();
  }
  campground = await Campground.find({});
  console.log("inserted");
}
seedDB();