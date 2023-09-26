import React, { useState } from "react";
import { GoogleMap, InfoWindow, Marker } from "@react-google-maps/api";
import { markerdata as markers } from "../data/markerdata";

export const Map = ({center}) => {
  const [activeMarker, setActiveMarker] = useState(null);

  const handleActiveMarker = (marker) => {
    if (marker === activeMarker) {
      return;
    }
    setActiveMarker(marker);
  };

  const handleOnLoad = (map) => {
    const bounds = new google.maps.LatLngBounds();
    markers.forEach(({ position }) => bounds.extend(position));
    map.fitBounds(bounds);
  };

  const defaultMapOptions = {
    disableDefaultUI: true,
  };

  return (
    <GoogleMap
      onLoad={handleOnLoad}
      onClick={() => setActiveMarker(null)}
      mapContainerStyle={{ width: "100vw", height: "100vh" }}
      zoom={12}
      options={defaultMapOptions}
      center={center}
    >
      {markers.map(({ id, name, position }) => (
        <Marker
          key={id}
          icon={{
            url: "https://media.discordapp.net/attachments/1154651284788498432/1154658283232178186/BinMarker-removebg-preview.png",
            scaledSize: new window.google.maps.Size(60, 60),
          }}
          position={position}
          onClick={() => handleActiveMarker(id)}
        >
          {activeMarker === id ? (
            <InfoWindow onCloseClick={() => setActiveMarker(null)}>
              <div>{name}</div>
            </InfoWindow>
          ) : null}
        </Marker>
      ))}
    </GoogleMap>
  );
};