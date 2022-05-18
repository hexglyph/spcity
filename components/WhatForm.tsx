import { useState, useEffect, useRef } from "react";
import { What3wordsAutosuggest, What3wordsMap } from "@what3words/react-components";

export interface Response {
    coordinates: any;
}

export default function WhatForm() {
  const [value, setValue] = useState("");
  const onChange = (e) => setValue(e.target.value);
  const mapRef = useRef(null);

  const input3Words = (e) => {
    console.log(e);
    const enteredName = e.target.value;
    console.log(enteredName);
    setValue(enteredName);    

    let google = window.google;
    let map = mapRef.current;
    let lat = -23.54748429489416;
    let lng = -46.637100424385785;
    const myLatlng = new google.maps.LatLng(lat, lng);
    const mapOptions = {
      zoom: 17,
      center: myLatlng,
      scrollwheel: false,
      zoomControl: true,
    };

    let markers = []
    fetch(`https://api.what3words.com/v3/convert-to-coordinates?words=filled.count.soap&key=${process.env.NEXT_PUBLIC_WORD_API_KEY}`)
      .then((res) => {
        // @ts-ignore
        if(res.coordinates){
          markers.forEach((marker) => {
            marker.setMap(null);
          })
          markers = [];
          // @ts-ignore
          let latLng = { lat: res.coordinates.lat, lng: res.coordinates.lng }
          let marker = new google.maps.Marker({
            position: latLng,
            map: map,
            // @ts-ignore
            title: value.detail.suggestion.words,
            icon: 'https://map.what3words.com/map/marker.png'
          });
          markers.push(marker);

          map.setCenter(latLng);
          map.setZoom(17);
        }
      })
  }


  useEffect(() => {
        })

  return (
      <div className="w-full p-8 m-2 rounded-lg bg-slate-300">
      <label htmlFor="w3w" className="font-semibold text-slate-600 sr-only">Localização</label>
      <What3wordsAutosuggest api_key={`${process.env.WHAT3WORDS_API_KEY}`} 
        clip_to_country="BR"
        language="pt"
        invalid_address_error_message="Localização não encontrada">
        <input
          id="w3w"
          placeholder="exemplo: ///enfeitam.bois.tensão"
          type="text"
          value={value}
          onChange={input3Words}
          className="input-field"
        />
      </What3wordsAutosuggest>
      </div>
  );
}


//variant="inherit"
//process.env.NEXT_PUBLIC_WORD_API_KEY