/* eslint-disable func-names */
/* eslint-disable vars-on-top */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable comma-dangle */
/* eslint-disable no-plusplus */
/* eslint-disable no-console */
/* eslint-disable no-var */
/* eslint-disable linebreak-style */
/* eslint-disable object-shorthand */
/* eslint-disable no-undef */
/* eslint-disable max-len */
/* eslint-disable indent */
var gridData;

      // Add the what3words grid to the Google Map data layer once the desired zoom level is meet
      map.addListener('bounds_changed', function () {
        const zoom = map.getZoom();
        const loadFeatures = zoom > 17;

        if (loadFeatures) {
          // Zoom level is high enough
          var ne = map.getBounds().getNorthEast();
          var sw = map.getBounds().getSouthWest();

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
              }
            })
            .then(function (data) {
              if (gridData !== undefined) {
                for (var i = 0; i < gridData.length; i++) {
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
        });
      });
