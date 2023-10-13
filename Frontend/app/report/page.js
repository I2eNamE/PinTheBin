'use client'

import React, { useState, useEffect } from 'react';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { BsFillPinMapFill } from 'react-icons/bs';
import { ToggleButtons } from '../addbin/components/togglebutton';
import { getCurrentLocation } from '../home/utils/getcurrentlocation';

export default function ReportBin() {
  const [buttonStates, setButtonStates] = useState(null);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [markerName, setMarkerName] = useState('');
  const [locationValue, setLocationValue] = useState({ lat: 0, lng: 0 });
  const [reportCategory, setReportCategory] = useState('');
  const [reportContent, setReportContent] = useState('');

  const handleButtonStateChange = (newButtonStates) => {
    setButtonStates(newButtonStates);
  };

  const addMarkerToMap = (name, location, buttonStates) => {
    // Your logic to add the marker to the map goes here
    console.log('Adding marker to the map:', name, location, buttonStates);
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

  useEffect(() => {
    getLocation();
  }, []);

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
    <img
      src="https://cdn.discordapp.com/attachments/1154651284788498432/1156160485025120336/405bcae6a8367d49f44c04d4362d7340.png?ex=6513f5dc&is=6512a45c&hm=346a5415f0b333b0aac6f08cad2d79b4a66bf092b428eb9bc47ed9abab789411&"
      alt="Report Bin"
      className="w-6 h-6 mr-2"
    />
  ) : (
    'ยืนยันการรายงาน'
  );

  const reportCategories = [
    'ปัญหาการใช้งานทั่วไปใน Pin The Bin',
    'ไม่สามารถหาตำแหน่งปัจจุบันได้',
    'ส่งข้อเสนอแนะ',
    'อื่น ๆ',
  ];

  return (
    <div className="bg-f4f4f4 p-8 min-h-screen font-NotoSansThai font-medium">
      <div className="flex items-center justify-between mb-3">
        <a href="/home">
          <button className="text-xl focus:outline-none hover:scale-110 transition-all">
            <IoMdArrowRoundBack size={40} />
          </button>
        </a>
        <h2 className="text-3xl">รายงาน</h2>
        <div className="w-8"></div>
      </div>

      <div className="p-8 flex flex-col justify-center items-center">
        <form>
          <div className="mb-4">
            <label htmlFor="description" className="block text-xl text-left mb-1">
              หัวข้อการรายงาน
            </label>
            <textarea
              type="text"
              id="description"
              className="block p-4 border border-ebebeb rounded-xl focus:outline-none bg-ffffff font-normal w-full"
              placeholder="เพิ่มหัวข้อการรายงาน"
              required
              value={markerName}
              onChange={(e) => setMarkerName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="reportCategory" className="block text-xl text-left mb-1">
              หมวดหมู่การรายงาน
            </label>
            <select
              id="reportCategory"
              className="block p-4 border border-ebebeb rounded-xl focus:outline-none bg-ffffff font-normal w-full"
              value={reportCategory}
              required
              onChange={(e) => setReportCategory(e.target.value)}
            >
              <option value="" disabled>Select a category</option>
              {reportCategories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="">
            <label htmlFor="reportContent" className="block text-xl text-left mb-1">
              เนื้อหาการรายงาน
            </label>
            <textarea
              type="text"
              id="reportContent"
              className="block p-4 border border-ebebeb rounded-xl focus:outline-none bg-ffffff font-normal w-full"
              placeholder="เพิ่มเนื้อหาการรายงาน"
              required
              value={reportContent}
              onChange={(e) => setReportContent(e.target.value)}
            />
          </div>
        </form>
      </div>

      <div className="flex justify-center">
        <a href="/home">
            <button
            onClick={() => {
                addMarkerToMap(markerName, locationValue, buttonStates);
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
  );
};
