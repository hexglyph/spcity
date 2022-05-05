/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
/* eslint-disable no-shadow */
/* eslint-disable linebreak-style */
/* eslint-disable object-shorthand */
/* eslint-disable no-undef */
/* eslint-disable max-len */
/* eslint-disable indent */
// Create the Google Map
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? 'Error: The Geolocation service failed.'
      : "Error: Your browser doesn't support geolocation.",
  );
  infoWindow.open(map);
}

const map = new google.maps.Map(document.getElementById('map'), {
  center: { lat: 51.52086, lng: -0.195499 },
  zoom: 13,
  mapTypeId: 'roadmap',
});

let markers = [];

const autosuggest = document.getElementById('autosuggest');
autosuggest.addEventListener('selected_suggestion', (value) => {
  // console.log('[EVENT:select]', value.detail.suggestion.words);

  // Call the what3words convert to coordinates API to obtain the latitude and longitude of the three word address provided
  what3words.api.convertToCoordinates(value.detail.suggestion.words).then((response) => {
    // console.log('[convertToCoordinates]', response);
    if (response.coordinates) {
      // Clear out the old markers.
      markers.forEach((marker) => {
        marker.setMap(null);
      });
      markers = [];

      const latLng = { lat: response.coordinates.lat, lng: response.coordinates.lng };

      // Create a marker for the location
      const marker = new google.maps.Marker({
        position: latLng,
        map: map,
        title: value.detail.suggestion.words,
        icon: 'https://map.what3words.com/map/marker.png',
      });
      markers.push(marker);

      // Center the map on that location, and zoom in on it
      map.setCenter(latLng);
      map.setZoom(20);
    }
  });
});
