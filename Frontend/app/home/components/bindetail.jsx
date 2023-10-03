import { MdFlag } from "react-icons/md";
import { BiSolidPencil } from "react-icons/bi";
import { MdPinDrop, MdInfo } from "react-icons/md";
import { bindetaildata } from "../data/bindetaildata";
import { BsChevronCompactDown } from "react-icons/bs";
import BinTypes from "./bintype";
import React, { useState } from "react";
import '../components/style.css'

const formatDate = (timestamp) => {
    const options = {
      timeZone: 'Asia/Bangkok',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    };
    const formattedDate = new Date(timestamp).toLocaleString('en-GB', options);
    return formattedDate;
  };

export const BinDetail = ({ onClose }) => {
    // Assuming there's only one item in bindetaildata array
    const binData = bindetaildata[0];

    const [reviews, setReviews] = useState([
        { id: 1, user: "John Doe", comment: "Great bin!" },
        { id: 2, user: "Jane Smith", comment: "Could be cleaner." },
    ]);


    return (
        <div className="bin-detail-overlay">
            <div className=" w-full py-10 font-NotoSansThai">
                <div className="bindetail bg-f4f4f4 md:w-96 rounded-xl overflow-y-auto no-scrollbar" style={{ maxHeight: '80vh', overflowScrolling: 'touch' }}>
                    <div className="bin-detail-close flex justify-center bg-f4f4f4 rounded-xl w-full md:w-96 cursor-pointer hover:scale-110 hover:bg-ebebeb transition" onClick={onClose}>
                        <BsChevronCompactDown size={50} color="#505050" />
                    </div>
                    <div className="bg-ffffff rounded-xl m-3">
                        <img
                            src={binData.picture}
                            alt="Background"
                            className="rounded-xl w-full h-full object-cover"
                        />
                    </div>
                    <div className="bg-ffffff rounded-xl p-4 m-3">
                        <div className="flex justify-end">
                            <a href="/reportbin">
                                <button className="bg-ffffff rounded-lg border border-ebebeb p-2 shadow-lg hover:scale-105 hover:bg-ebebeb transition">
                                    <MdFlag size={30} color="#505050" />
                                </button>
                            </a>
                            <a href="/editbin">
                                <button className="bg-ffffff rounded-lg border border-ebebeb p-2 shadow-lg ml-1 hover:scale-105 hover:bg-ebebeb transition">
                                    <BiSolidPencil size={30} color="#505050" />
                                </button>
                            </a>
                        </div>
                        <div className="flex justify-start items-center">
                            <MdPinDrop size={30} color="#505050" />
                            <p className="text-2xl font-medium pl-2">ตำแหน่งที่ตั้ง</p>
                        </div>
                        <p className="bin-location text-2xl mt-2 ml-5 mr-5 mb-5 font-normal text-717171">{binData.location}</p>
                        <div className="flex justify-start items-center">
                            <MdInfo size={30} color="#505050" />
                            <p className="text-2xl font-medium pl-2">คำอธิบาย</p>
                        </div>
                        <p className="bin-description text-2xl mt-2 ml-5 mr-5 mb-5 font-normal text-717171">{binData.description}</p>
                        <div className="flex justify-center items-center">
                            <p className="text-2xl font-medium pl-2">ประเภทถังขยะ</p>
                        </div>
                        <div>
                            <BinTypes bins={binData} />
                        </div>
                        <p className="flex justify-center text-base font-thin pl-2 mt-5">
                            แก้ไขล่าสุดเมื่อ {formatDate(binData.timestamp)}
                        </p>


                        {/* <div className="flex justify-start items-center mt-2">
                            <MdInfo size={30} color="#505050" />
                            <p className="text-2xl font-medium pl-2">รีวิวจากผู้ใช้</p>
                        </div>
                        {reviews.map((review) => (
                            <div key={review.id} className="user-review mt-2 ml-5 mr-5 mb-5">
                                <p className="font-medium">{review.user}:</p>
                                <p className="font-normal">{review.comment}</p>
                            </div>
                        ))} */}
                    </div>
                </div>
            </div>
        </div>
    );
};
