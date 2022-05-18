import Reach, { useState, useEffect, useRef } from "react";
import {  GridSectionClient, GridSectionOptions, GridSectionGeoJsonResponse, AvailableLanguagesClient } from "@what3words/api";
import { What3wordsAutosuggest, What3wordsMap } from "@what3words/react-components";

export default function GoogleMap() {
  const [value, setValue] = useState("");
  const onChange = (e) => setValue(e.target.value);
  const mapRef = useRef(null);

  useEffect(() => {
    let google = window.google;
    let map = mapRef.current;
    let lat = -23.54748429489416;
    let lng = -46.637100424385785;
    const myLatlng = new google.maps.LatLng(lat, lng);
    const mapOptions = {
      zoom: 12,
      center: myLatlng,
      scrollwheel: false,
      zoomControl: true,
    };

    map = new google.maps.Map(map, mapOptions);
    let gridData;
    map.addListener('bounds_changed', (event) => {
        const zoom = map.getZoom();
        const loadFeatures = zoom > 17;

        if (loadFeatures) {
          let ne = map.getBounds().getNorthEast();
          let sw = map.getBounds().getSouthWest();

          
          fetch(`https://api.what3words.com/v3/grid-section?bounding-box=${sw.lat()},${sw.lng()},${ne.lat()},${ne.lng()}&format=geojson&key=${process.env.NEXT_PUBLIC_WORD_API_KEY}`)
          .then(res => res.json())
          .then(data => {
            if(gridData !== undefined){
              for (let i = 0; i < gridData.length; i++) {
                map.data.remove(gridData[i])
              }
            }
            gridData = map.data.addGeoJson(data)
          })
          .catch(console.error)

          
          

          /*
            const gridSectionClient: GridSectionClient = GridSectionClient.init(process.env.NEXT_PUBLIC_WORD_API_KEY);
            const gridSectionOptions: GridSectionOptions = {
              southwest: { lat: sw.lat(), lng: sw.lng() },
              northeast: { lat: ne.lat(), lng: ne.lng() }
            }
            gridSectionClient.run(gridSectionOptions)
            .then((res: GridSectionResponse) => {
              const geoJson = {
                type: 'FeatureCollection',
                features: res.features,
              };
              const geoJsonLayer = new google.maps.Data({ map: map });
              geoJsonLayer.addGeoJson(geoJson);
          });
          */
       

        /*
            const gridSectionClient = new GridSectionClient(process.env.NEXT_PUBLIC_WORD_API_KEY);
            gridSectionClient.run({
              southwest: { lat: sw.lat(), lng: sw.lng() },
              northeast: { lat: ne.lat(), lng: ne.lng() },
            }).then((res: GridSectionGeoJsonResponse) => {
              console.log(res);
              const geoJson = {
                type: 'FeatureCollection',
                features: res.features,
              };
              const geoJsonLayer = new google.maps.Data({ map: map });
              geoJsonLayer.addGeoJson(geoJson);
          });*/
        //});


      map.data.setStyle({
          visible: loadFeatures,
          strokeColor: '#777',
          strokeWeight: 0.5,
          clickable: false
        })

      }
    });
/*
    const autosuggest = document.getElementById("autosuggest");
    console.log(autosuggest);
    autosuggest.addEventListener("selected_suggestion", (value) => {
        console.log("[EVENT:select]", value.detail.suggestion.words);})

        // Call the what3words convert to coordinates API to obtain the latitude and longitude of the three word address provided
        what3words.api.convertToCoordinates(value.detail.suggestion.words).then((response) => {
          console.log("[convertToCoordinates]", response);
          if (response.coordinates) {
            // Clear out the old markers.
            markers.forEach((marker) => {
              marker.setMap(null);
            });
            markers = [];

            var latLng = { lat: response.coordinates.lat, lng: response.coordinates.lng };

            // Create a marker for the location
            var marker = new google.maps.Marker({
              position: latLng,
              map: map,
              title: value.detail.suggestion.words,
              icon: 'https://map.what3words.com/map/marker.png'
            });
            markers.push(marker);

            // Center the map on that location, and zoom in on it
            map.setCenter(latLng);
            map.setZoom(20);
          }
        });
      });*/
    

    

    /*const marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
      animation: google.maps.Animation.DROP,
      title: "Notus NextJS!",
    });*/

    //const contentString = '<div class="info-window-content"><h2>Notus NextJS</h2>' + "<p>A free Admin for Tailwind CSS, React, React Hooks, and NextJS.</p></div>";
    //const infowindow = new google.maps.InfoWindow({content: contentString, });
    //google.maps.event.addListener(marker, "click", function () {infowindow.open(map, marker); });
  });

  


  return (
    <>
    <div className="w-full p-8 m-2 rounded-lg bg-slate-300">
      <label htmlFor="w3w" className="font-semibold text-slate-600 sr-only">Localização</label>
      <What3wordsAutosuggest api_key={`${process.env.NEXT_PUBLIC_WORD_API_KEY}`} 
        clip_to_country="BR"
        language="pt"
        invalid_address_error_message="Localização não encontrada">
        <input
          id="w3w"
          type="text"
          value={value}
          onChange={onChange}
          className="input-field"
        />
      </What3wordsAutosuggest>
      </div>
      <div className="relative w-full rounded h-full">
        <div className="rounded w-full h-full" ref={mapRef} />
      </div>
    </>
  );
}


/*styles: [
        {
          featureType: "administrative",
          elementType: "labels.text.fill",
          stylers: [{ color: "#444444" }],
        },
        {
          featureType: "landscape",
          elementType: "all",
          stylers: [{ color: "#f2f2f2" }],
        },
        {
          featureType: "poi",
          elementType: "all",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "road",
          elementType: "all",
          stylers: [{ saturation: -100 }, { lightness: 45 }],
        },
        {
          featureType: "road.highway",
          elementType: "all",
          stylers: [{ visibility: "simplified" }],
        },
        {
          featureType: "road.arterial",
          elementType: "labels.icon",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "transit",
          elementType: "all",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "water",
          elementType: "all",
          stylers: [{ color: "#cbd5e0" }, { visibility: "on" }],
        },
      ],*/