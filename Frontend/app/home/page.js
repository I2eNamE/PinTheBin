'use client'

import React, { useState, useEffect } from 'react';
import { useJsApiLoader } from "@react-google-maps/api";
import { Sidebar } from "./components/sidebar";
import { Topbar } from './components/topbar';
import { BinDetail } from './components/bindetail';
import { AddBinBtn } from './components/addbinbtn';
import { SetCenterBtn } from './components/setcenterbtn';
import { Map } from './components/map';
import { markerdata as markers } from "./data/markerdata";
import "./components/style.css";

export default function Home() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_googleMapsApiKey
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const [isBinDetailVisible, setIsBinDetailVisible] = useState(false);
  const toggleBinDetail = () => {
    setIsBinDetailVisible(!isBinDetailVisible);
  };

  // Set current location in state
  const defaultCenter = { // Default center coordinates
    lat: 13.8242059,
    lng: 100.5159011
  };
  
  const [currentLocation, setCurrentLocation] = useState(defaultCenter); // Initialize with default center
  
  const addMarkerToMap = () => {
    setcurrentLocation()
    console.log(currentLocation);
    markers.push({
      id: markers.length + 1,
      name: "Test Marker",
      position: currentLocation,
    });
    console.log(markers); // Log the updated markers array
  };

  const setcurrentLocation = (location) => {
    setCurrentLocation(location); // Set the current location in state
    console.log(markers);
  }

  useEffect(() => {
    console.log(currentLocation); // This will log the updated currentLocation
  }, [currentLocation]); // This useEffect will run whenever currentLocation changes


  return (
    <div>
      <div className="map-container">
        {isLoaded && <Map center={currentLocation} />}
      </div>
      <div className={`sidebar-dim ${isSidebarOpen ? "open" : ""}`} onClick={toggleSidebar}></div>
      <div className="home-topbar">
        <Topbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </div>
      <div className={`home-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        {isSidebarOpen && <Sidebar isSidebarOpen={isSidebarOpen} />}
      </div>
      <div className={`home-bindetail ${isBinDetailVisible ? 'open' : ''}`}>
        <BinDetail onClose={toggleBinDetail} />
      </div>
      <div className="home-addbinbtn absolute bottom-5 right-5">
        <div className="flex flex-col">
          <div className='pb-5'>
            <SetCenterBtn onGetCurrentLocation={setcurrentLocation} />
          </div>
          <a href="/addbin">
            <AddBinBtn/>
          </a>
        </div>
      </div>

      <div
        className={`sidebar-dim ${isBinDetailVisible ? 'open' : ''}`}
        onClick={toggleBinDetail}
      ></div>

      {/* DevMode */}
      <div className="absolute bottom-5 left-5 flex">
        <button className="w-16 h-16 bg-ffffff rounded-lg shadow-lg focus:outline-none hover:scale-105 hover:bg-ebebeb transition" onClick={addMarkerToMap}>Add Marker</button>
        <button
          className="w-24 h-16 ml-2 bg-ffffff rounded-lg shadow-lg focus:outline-none hover:scale-105 hover:bg-ebebeb transition"
          onClick={toggleBinDetail}
        >
          Show Bin Detail
        </button>
      </div>
    </div>
  );
}