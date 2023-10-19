'use client'

import React, { useState, useEffect } from 'react';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { BsFillPinMapFill } from 'react-icons/bs';
import { ToggleButtons } from './components/togglebutton';
import { getCurrentLocation } from '../home/utils/getcurrentlocation';
import Image from 'next/image'
import axios from "../httpAxios";
import { useRouter } from 'next/navigation';

export default function Addbin() {
  const router = useRouter();
  const [buttonStates, setButtonStates] = useState(null);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [markerName, setMarkerName] = useState('');
  const [locationName, setLocationName] = useState('');
  const [locationValue, setLocationValue] = useState({ lat: 0, lng: 0 });
  const [binTypes, setBinTypes] = useState([]);
  // const [binId, setbinId] = useState(0);
  const [buttonContent, setButtonContent] = useState({
    imgUrl: '',
    bgColor: '',
    message: '',
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  let url = 'http://localhost:8080/';
  
  const handleButtonStateChange = (newButtonStates) => {
    setButtonStates(newButtonStates);
    const activeBinTypes = Object.keys(newButtonStates).filter(
      (binType) => newButtonStates[binType].active
    );
    setBinTypes(activeBinTypes);
  };

  const addMarkerToMap = (locationName, name, location, binTypes) => {
    // console.log("binTypes", binTypes);
    console.log("post: ", {
      location: locationName,
      lat: location.lat,
      lng: location.lng,
      binType: binTypes,
      description: name,
    });
    
    axios.post(url + 'bin', {
      location: locationName,
      lat: location.lat,
      lng: location.lng,
      binType: binTypes,
      description: name,
    },{ headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } }).then((response) => {
      console.log(response);
      if (response.status === 201) {
        console.log('Bin added successfully.');
        setButtonContent({
          imgUrl: '/static/Checkmark.png',
          bgColor: 'bg-39da00',
        });

        // console.log('binId :', binId);
        // console.log(response.data.result.insertId);
        // console.log(typeof(response.data.result.insertId));
        // console.log(typeof(response.data.result.insertId))        // console.log(typeof(response.data.result.insertId))e.data.result.insertId))
        // console.log(thisisbinId)
        // window.location.href = '/home';
      }
      else {
      setButtonContent({
        imgUrl: '/static/Cancel.png',
        bgColor: 'bg-ff5151',
        message: 'Bin has already been added to the database.',
      });
      }
    }).catch((error) => {
      console.log(error)
      console.log('Error: Bin has already been added to the database.');
    });

  //   const fileName = `bin_${binId}`;
  //   // Upload the file
  //   console.log('filename:',fileName)
  //   uploadFile(fileName);

  // const uploadFile = (fileName) => {
  //   const formData = new FormData();
  //   formData.append('fileInput', selectedFile); // assuming 'selectedFile' is the file selected by the user
  //   console.log('AXIOS_POST_FILE')
  //   axios.post(`${url}upload`, formData, {
  //       headers: {
  //           'Authorization': 'Bearer ' + localStorage.getItem('token'),
  //           'Content-Type': 'multipart/form-data',
  //       },
  //   }).then((response) => {
  //       console.log(response);
  //       // Now you can handle the response as needed
  //   }).catch((error) => {
  //       console.log(error);
  //       // Handle file upload error
  //   });
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
  
  const handleButtonClick = () => {
    const newButtonStates = {
      ...buttonStates,
      // Update this based on your actual button states
    };
    handleButtonStateChange(newButtonStates);
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log('File selected:', file);
    setSelectedFile(file);
  };

  useEffect(() => {
    // Call getLocation when the component mounts
    getLocation();
    if (localStorage.getItem('token') == null){
      router.push('/')
    }
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
              ชื่อสถานที่
            </label>
            <textarea
              type="text"
              id="description"
              className="block p-4 border border-ebebeb rounded-xl focus:outline-none bg-ffffff font-normal w-full"
              placeholder="ใส่ชื่อสถานที่ใกล้เคียง"
              required
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-xl text-left mb-1">
              คำอธิบาย
            </label>
            <textarea
              type="text"
              id="description"
              className="block p-4 border border-ebebeb rounded-xl focus:outline-none bg-ffffff font-normal w-full"
              placeholder="ใส่คำอธิบายเพิ่มเติม"
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

      <div className="flex flex-col items-center justify-center mt-4">
        {buttonContent.message === 'Bin has already been added to the database.' && (
          <p className="text-sm mb-2 text-FF0000 text-white p-2 rounded-md">
            ถังขยะนี้มีอยู่แล้ว
          </p>
        )}
        <button
          onClick={() => {
            addMarkerToMap(locationName, markerName, locationValue, binTypes);
            setLocationValue({ lat: 0, lng: 0 });
          }}
          className={`flex items-center justify-center p-4 w-60 py-2 px-4 rounded-lg transition-all focus:outline-none ${
            buttonContent.bgColor ? buttonContent.bgColor : 'bg-717171 text-ffffff hover:scale-105'
          }`}
        >
          {buttonContent.message ? (
            <>
              <Image
                src={buttonContent.imgUrl}
                alt="เพิ่มถังขยะ"
                width="100"
                height="100"
                className="w-6 h-6"
              />
            </>
          ) : (
            'เพิ่มถังขยะ'
          )}
        </button>
      </div>
    </div>
  );
}
