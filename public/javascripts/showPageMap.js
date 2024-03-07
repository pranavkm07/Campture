mapboxgl.accessToken = mapboxToken;
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/outdoors-v12', // style URL
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 12, // starting zoom
});
const marker = new mapboxgl.Marker()
                  .setLngLat(campground.geometry.coordinates)
                  .setPopup(
                    new mapboxgl.Popup({offset : 25})
                    .setHTML(
                      `<h5>${campground.title}</h5><h6>${campground.location}</h6>`
                    )
                  )
                  .addTo(map)