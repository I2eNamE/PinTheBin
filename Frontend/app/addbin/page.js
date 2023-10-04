'use client'

import React, { useState, useEffect } from 'react';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { BsFillPinMapFill } from 'react-icons/bs';
import { ToggleButtons } from '../addbin/components/bintype';
import { getCurrentLocation } from '../home/utils/getcurrentlocation';
import { markerdata as markers } from '../home/data/markerdata';
import axios from "axios";

export default function Addbin() {
  const [buttonStates, setButtonStates] = useState(null);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [markerName, setMarkerName] = useState('');
  const [locationValue, setLocationValue] = useState({ lat: 0, lng: 0 });
  const [binTypes, setBinTypes] = useState([]);

  let url = 'http://localhost:8080/';
  
  const handleButtonStateChange = (newButtonStates) => {
    setButtonStates(newButtonStates);
    // Extract bin types from buttonStates and set it in the state
    const activeBinTypes = Object.keys(newButtonStates).filter(
      (binType) => newButtonStates[binType].active
    );
    setBinTypes(activeBinTypes);
  };

  const addMarkerToMap = (name, location, binTypes) => {
    axios.post(url+'bin', {
      location: 'ทดสอบชื่อสถานที่',
      lat: location.lat,
      lng: location.lng,
      binType: binTypes,
      description: name,
    }).then((response) => {
      console.log(response);
    }
    ).catch((error) => {
      console.log(error);
    }
    );
    // markers.push({
    //   id: markers.length + 1,
    //   description: name,
    //   lng: location.lng,
    //   lat: location.lat,
    //   binType: binTypes,
    // });
    // console.log(markers);
  };

  // Function to get the user's location
  const getLocation = () => {
    getCurrentLocation(
      (userLocation) => {
        // Update the locationValue state with the obtained location
        setLocationValue(userLocation);
        console.log('User location:', userLocation);
      },
      (error) => {
        console.error('Error getting user location:', error);
      }
    );
  };

  const handleButtonClick = (buttonName) => {
    // Use the onButtonStateChange function passed from props to update the parent state
    const newButtonStates = {
      ...buttonStates,
      [buttonName]: {
        ...buttonStates[buttonName],
        active: !buttonStates[buttonName].active,
      },
    };
    onButtonStateChange(newButtonStates);
  };

  const buttonContent = isButtonClicked ? (
    <>
      <img
        src="https://cdn.discordapp.com/attachments/1154651284788498432/1156160485025120336/405bcae6a8367d49f44c04d4362d7340.png?ex=6513f5dc&is=6512a45c&hm=346a5415f0b333b0aac6f08cad2d79b4a66bf092b428eb9bc47ed9abab789411&"
        alt="เพิ่มถังขยะ"
        className="w-6 h-6 mr-2"
      />
    </>
  ) : (
    'เพิ่มถังขยะ'
  );
  
  const handleFileChange = (e) => {
    // Handle file changes here if needed
    console.log('File selected:', e.target.files[0]);
  };

  useEffect(() => {
    // Call getLocation when the component mounts
    getLocation();
  }, []);

  return (
    <div className="bg-f4f4f4 p-8 min-h-screen font-NotoSansThai font-medium">
      <div className="flex items-center justify-between mb-3">
        <a href="/home">
          <button className="text-xl focus:outline-none hover:scale-110 transition-all">
            <IoMdArrowRoundBack size={40} />
          </button>
        </a>
        <h2 className="text-3xl">เพิ่มถังขยะ</h2>
        <div className="w-8"></div>
      </div>

      <div className="p-8 flex flex-col justify-center items-center">
        <form>
          <div className="mb-4">
            <label htmlFor="description" className="block text-xl text-left mb-1">
              คำอธิบาย
            </label>
            <textarea
              type="text"
              id="description"
              className="block p-4 border border-ebebeb rounded-xl focus:outline-none bg-ffffff font-normal w-full"
              placeholder="ใส่คำอธิบายเพิ่มเติม เช่นสถานที่ใกล้เคียง"
              required
              value={markerName}
              onChange={(e) => setMarkerName(e.target.value)}
            />
          </div>
          <div className="relative mb-4"> {/* Add 'relative' class for positioning */}
            <label htmlFor="location" className="block text-xl text-left mb-1">
              ตำแหน่ง
            </label>
            <textarea
              type="text"
              id="location"
              className="block p-4 border border-ebebeb rounded-xl focus:outline-none bg-ffffff font-normal w-full"
              placeholder="ที่อยู่ของถังขยะ"
              required
              value={`${locationValue.lat}, ${locationValue.lng}`}
              onChange={(e) => setLocationValue(e.target.value)} 
            />
            <button
              onClick={getLocation}
              className="absolute top-0 right-0 mt-2 mr-2 rounded-full hover:scale-110 transition"
            >
              <BsFillPinMapFill size={20} />
            </button>
          </div>
          <div>
            <label htmlFor="file" className="block text-xl text-left mb-1">
              อัปโหลดรูปภาพ
            </label>
            <input
              type="file"
              id="file"
              accept="image/*"  // Specify accepted file types if needed
              onChange={handleFileChange}
              className="block p-2 border border-ebebeb rounded-xl focus:outline-none bg-ffffff font-normal w-full"
            />
          </div>
        </form>
      </div>

      <div className="flex flex-col">
        <div className="flex justify-center items-center">
          <ToggleButtons onButtonStateChange={handleButtonStateChange} />
        </div>
      </div>
      <div className="mt-4 flex justify-center">
        {/* <a href="/home"> */}
          <button
            onClick={() => {
              addMarkerToMap(markerName, locationValue, binTypes);
              setLocationValue({ lat: 0, lng: 0 });
              setIsButtonClicked(true)
            }}
            className={`flex items-center justify-center p-4 w-60 py-2 px-4 rounded-lg transition-all focus:outline-none ${
              isButtonClicked ? 'bg-39da00 text-ffffff' : 'bg-717171 text-ffffff hover:scale-105'
            }`}
          >
            {buttonContent}
          </button>
        {/* </a> */}
      </div>
    </div>
  );
}
