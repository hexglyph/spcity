import what3words from '@what3words/api';

let map: google.maps.Map;

function initMap(): void {
  map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
  });

  let gridData;

  // Add the what3words grid to the Google Map data layer once the desired zoom level is meet
  map.addListener('bounds_changed', function () {
    const zoom = map.getZoom();
    const loadFeatures = zoom > 17;

    if (loadFeatures) {
      // Zoom level is high enough
      const ne = map.getBounds().getNorthEast();
      const sw = map.getBounds().getSouthWest();

      // Call the what3words Grid API to obtain the grid squares within the current visble bounding box
      what3words.api
        .gridSectionGeoJson({
          southwest: {
            lat: sw.lat(),
            lng: sw.lng(),
          },
          northeast: {
            lat: ne.lat(),
            lng: ne.lng(),
          },
        })
        .then(function (data) {
          if (gridData !== undefined) {
            for (let i = 0; i < gridData.length; i++) {
              map.data.remove(gridData[i]);
            }
          }
          gridData = map.data.addGeoJson(data);
        })
        .catch(console.error);
    }

    // Set the grid display style
    map.data.setStyle({
      visible: loadFeatures,
      strokeColor: '#777',
      strokeWeight: 0.5,
      clickable: false,
    });
  });
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
