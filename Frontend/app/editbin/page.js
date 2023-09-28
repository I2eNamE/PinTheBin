'use client'

import React, { useState, useEffect } from 'react';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { BsFillPinMapFill } from 'react-icons/bs';
import { MdDeleteForever } from 'react-icons/md'; // Import the delete icon
import { ToggleButtons } from '../addbin/components/bintype';
import { getCurrentLocation } from '../home/utils/getcurrentlocation';
import { ConfirmDelete } from './components/confirmdelete';
import { markerdata as markers } from '../home/data/markerdata';
import './components/style.css';

export default function EditBin() {
  const [buttonStates, setButtonStates] = useState(null);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [isConfirmDeleteVisible, setIsConfirmDeleteVisible] = useState(false);
  const [markerName, setMarkerName] = useState('');
  const [locationValue, setLocationValue] = useState({ lat: 0, lng: 0 });

  const handleCancelDelete = () => {
    setIsConfirmDeleteVisible(false);
  };

  const handleButtonStateChange = (newButtonStates) => {
    setButtonStates(newButtonStates);
  };

  const editMarkerOnMap = (name, location, buttonStates) => {
    // Your logic to edit the marker on the map goes here
    console.log('Editing marker on the map:', name, location, buttonStates);
  };

  const deleteMarkerOnMap = () => {
    // Your logic to delete the marker on the map goes here
    console.log('Deleting marker on the map');
    setIsConfirmDeleteVisible(true); // Show ConfirmDelete when delete button is clicked
  };

  const getLocation = () => {
    getCurrentLocation(
      (userLocation) => {
        setLocationValue(userLocation);
        console.log('User location:', userLocation);
      },
      (error) => {
        console.error('Error getting user location:', error);
      }
    );
  };

  const handleButtonClick = (buttonName) => {
    const newButtonStates = {
      ...buttonStates,
      [buttonName]: {
        ...buttonStates[buttonName],
        active: !buttonStates[buttonName].active,
      },
    };
    handleButtonStateChange(newButtonStates);
  };

  const buttonContent = isButtonClicked ? (
    <>
      <img
        src="https://cdn.discordapp.com/attachments/1154651284788498432/1156160485025120336/405bcae6a8367d49f44c04d4362d7340.png?ex=6513f5dc&is=6512a45c&hm=346a5415f0b333b0aac6f08cad2d79b4a66bf092b428eb9bc47ed9abab789411&"
        alt="แก้ไขถังขยะ"
        className="w-6 h-6"
      />
    </>
  ) : (
    'แก้ไขถังขยะ'
  );

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <div>
      <div className="bg-f4f4f4 p-8 min-h-screen font-NotoSansThai font-medium">
        <div className="flex items-center justify-between mb-3 mr-2">
          <a href="/home">
            <button className="text-xl focus:outline-none hover:scale-110 transition-all">
              <IoMdArrowRoundBack size={40}/>
            </button>
          </a>
          <h2 className="text-3xl">แก้ไขถังขยะ</h2>
          <div className="w-8">
            <button
              onClick={deleteMarkerOnMap}
              className="bg-ff5151 rounded-lg border border-ebebeb p-1 shadow-lg hover:scale-105 hover:bg-FF0000 transition"
            >
              <MdDeleteForever size={40} color="#ffffff" />
            </button>
          </div>
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
            <div className="relative"> {/* Add 'relative' class for positioning */}
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
          </form>
        </div>

        <div className="flex flex-col">
          <div className="flex justify-center items-center">
            <ToggleButtons onButtonStateChange={handleButtonStateChange} />
          </div>
        </div>
        <div className="mt-4 flex justify-center">
          <a href="/home" className='mt-4 flex justify-center'>
            <button
              onClick={() => {
                editMarkerOnMap(markerName, locationValue, buttonStates);
                setLocationValue({ lat: 0, lng: 0 });
                setIsButtonClicked(true)
              }}
              className={`flex items-center justify-center p-4 w-60 py-2 px-4 rounded-lg transition-all focus:outline-none ${
                isButtonClicked ? 'bg-39da00 text-ffffff' : 'bg-717171 text-ffffff hover:scale-105'
              }`}
            >
              {buttonContent}
            </button>
          </a>
        </div>
      </div>
      <div className={`dim ${isConfirmDeleteVisible ? 'open' : ''}`} onClick={handleCancelDelete}></div>
      {isConfirmDeleteVisible && (
        <ConfirmDelete onCancelDelete={handleCancelDelete} isVisible={isConfirmDeleteVisible}/>
      )}
    </div>
  );
}