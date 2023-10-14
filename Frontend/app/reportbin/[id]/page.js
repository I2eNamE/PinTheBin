'use client'

import React, { useState } from 'react';
import axios from 'axios';
import { IoMdArrowRoundBack } from 'react-icons/io';

const ReportBin = ({ params }) => {
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [headerName, setHeaderName] = useState('');
  const [reportCategory, setReportCategory] = useState('');
  const [reportContent, setReportContent] = useState('');
  const [buttonContent, setButtonContent] = useState({
    imgUrl: '',
    bgColor: '',
    message: '',
  });

  const submitReport = async () => {
    try {
      const response = await axios.post('http://localhost:8080/report', {
        user_report: '10', // Replace with actual user ID or username
        description: reportContent,
        category: reportCategory,
        header: headerName, // Replace with actual header
        bin: params.id, // Replace with actual bin ID or name
      });

      console.log(response);

      if (response.data.error) {
        // If there is an error, set appropriate feedback
        setButtonContent({
          imgUrl: 'https://media.discordapp.net/attachments/1154651284788498432/1159487242260201642/Cancel.png?ex=653133a4&is=651ebea4&hm=da5e4f720d6e3e712d9dfa6d1d9de09e5f253769bcac1f96609c6624b199cfc9&=&width=125&height=125',
          bgColor: 'bg-ff5151',
          message: response.data.message,
        });
      } else {
        // If successful, set appropriate feedback
        setButtonContent({
          imgUrl: 'https://cdn.discordapp.com/attachments/1154651284788498432/1156160485025120336/405bcae6a8367d49f44c04d4362d7340.png?ex=6513f5dc&is=6512a45c&hm=346a5415f0b333b0aac6f08cad2d79b4a66bf092b428eb9bc47ed9abab789411&',
          bgColor: 'bg-39da00',
          message: 'รายงานถังขยะเรียบร้อยแล้ว',
        });
        setIsButtonClicked(true);
        window.location.href = '/home';
      }
    } catch (error) {
      console.error('Error submitting report:', error);
    }
  };

  const reportCategories = [
    'มีกลิ่นเหม็น',
    'ขยะมากเกินไป',
    'หาถังขยะไม่เจอ',
    'ถังขยะผิดประเภท',
    'พื้นที่บริเวณนั้นไม่สะอาด',
    'ถังขยะเสียหายหรือใช้งานไมได้',
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
        <h2 className="text-3xl">รายงานถังขยะ</h2>
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
              value={headerName}
              onChange={(e) => setHeaderName(e.target.value)}
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
              required={reportCategory === 'อื่น ๆ'}
              value={reportContent}
              onChange={(e) => setReportContent(e.target.value)}
            />
          </div>
        </form>
      </div>

      <div className="flex flex-col items-center justify-center mt-4">
        {/* <a href="/home"> */}
          {buttonContent.message === 'this report has in database' && (
            <p className="text-sm mb-2 text-FF0000 text-white p-2 rounded-md">
              รายงานฉบับนี้มีอยู่แล้ว
            </p>
          )}
          <button
            onClick={submitReport}
            className={`flex items-center justify-center p-4 w-60 py-2 px-4 rounded-lg transition-all focus:outline-none ${
              buttonContent.bgColor ? buttonContent.bgColor : 'bg-717171 text-ffffff hover:scale-105'
            }`}
          >
            {buttonContent.message ? (
              <>
                <img
                  src={buttonContent.imgUrl}
                  alt="รายงานถังขยะ"
                  className="w-6 h-6"
                />
              </>
            ) : (
              'ยืนยันการรายงาน'
            )}
          </button>
        {/* </a> */}
      </div>
    </div>
  );
};

export default ReportBin;
