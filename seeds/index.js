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
  let campground; //* A mongoDB document 
  const paulObjectId = '65c859ff46cb76f177e9409a';
  for (let i = 0; i < 50; i++) {
    let random1000 = Math.floor(Math.random() * 1000);
    let price = Math.floor(Math.random() * 20) + 10;
    campground = new Campground({
      author: paulObjectId,
      title: `${getRandomValue(descriptors)} ${getRandomValue(places)}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      price: price,
      geometry: { 
        type: 'Point', 
        coordinates: [
          cities[random1000].longitude, 
          cities[random1000].latitude
        ] 
      },
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste pariatur, quisquam neque incidunt voluptates dolore delectus! Veniam eius hic numquam neque eaque dolores, culpa adipisci, omnis enim, inventore pariatur ex.',
      images: [{
        url: 'https://res.cloudinary.com/dlf59vhjs/image/upload/v1707825939/Campture/ay8f7iekgkpgtim25ult.jpg',
        filename: 'Campture/ay8f7iekgkpgtim25ult',
      },
      {
        url: 'https://res.cloudinary.com/dlf59vhjs/image/upload/v1707825944/Campture/ztpmnvmy5figjv7u9uab.jpg',
        filename: 'Campture/ztpmnvmy5figjv7u9uab',
      },
      {
        url: 'https://res.cloudinary.com/dlf59vhjs/image/upload/v1707825947/Campture/voaslypijuzfhr3deezb.jpg',
        filename: 'Campture/voaslypijuzfhr3deezb',
      }]

    })
    campground.save();
  }
  campground = await Campground.find({});
  console.log("inserted");
}
seedDB();