'use client'

import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { Sidebar } from "./components/sidebar";
import { Topbar } from './components/topbar';
import "./components/style.css";

const center = {
  lat: 13.819916,
  lng: 100.513468
};

function MyComponent() {
  const [screenSize, setScreenSize] = useState({
    dynamicWidth: typeof window !== 'undefined' ? window.innerWidth : 0,
    dynamicHeight: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  const setDimension = () => {
    setScreenSize({
      dynamicWidth: typeof window !== 'undefined' ? window.innerWidth : 0,
      dynamicHeight: typeof window !== 'undefined' ? window.innerHeight : 0
    });
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener("resize", setDimension);

      return () => {
        window.removeEventListener("resize", setDimension);
      };
    }
  }, []);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_googleMapsApiKey
  });

  const [map, setMap] = React.useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  return (
    <div>
      <div className="map-container">
      {isLoaded && (
        <div>
          <GoogleMap
            mapContainerStyle={{
              width: screenSize.dynamicWidth,
              height: screenSize.dynamicHeight
            }}
            center={center}
            zoom={10}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            {/* Child components, such as markers, info windows, etc. */}
            <></>
          </GoogleMap>
        </div>
      )}
      </div>

      <div className={`sidebar-dim ${isSidebarOpen ? "open" : ""}`} onClick={toggleSidebar}></div>
      
      <div className="home-topbar">
        <Topbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </div>
      <div className={`home-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        {isSidebarOpen && <Sidebar isSidebarOpen={isSidebarOpen} />}
      </div>
    </div>
  );
}

export default React.memo(MyComponent);
