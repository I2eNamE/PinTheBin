import React, { useState } from 'react';
import '../components/style.css'

export const ConfirmDelete = ({ onCancelDelete, isVisible }) => {
    const [isDeleteClicked, setisDeleteClicked] = useState(false);
    const handleCancel = () => {
        onCancelDelete();
      };

    const buttonDelContent = isDeleteClicked ? (
    <>
        <img
        src="https://cdn.discordapp.com/attachments/1154651284788498432/1156160485025120336/405bcae6a8367d49f44c04d4362d7340.png?ex=6513f5dc&is=6512a45c&hm=346a5415f0b333b0aac6f08cad2d79b4a66bf092b428eb9bc47ed9abab789411&"
        alt="ลบถังขยะ"
        className="w-6 h-6"
        />
    </>
    ) : (
    'ยืนยันการลบถังขยะ'
    );

    return (
        <div className="confirm-delete-overlay">
            <div className="flex justify-center w-full font-NotoSansThai">
                <div className={`confirmdelete-slide ${isVisible ? 'open' : ''} bg-f4f4f4 md:w-96 rounded-xl overflow-y-auto no-scrollbar`} style={{ maxHeight: '80vh', overflowScrolling: 'touch' }}>
                    <div className="p-4 m-3">
                        <div className="flex justify-center items-center">
                            <p className="text-2xl font-medium text-505050">ยืนยันการลบถังขยะ</p>
                        </div>
                        <div className="flex justify-center items-center">
                            <p className="text-base font-thin text-505050">คุณต้องการลบถังขยะนี้ใช่หรือไม่</p>
                        </div>
                        <div className='flex flex-col mt-4'>
                            <a href='/home' className='flex flex-col mt-4 '>
                                <button
                                    onClick={() => setisDeleteClicked(true)}
                                    className={`flex items-center justify-center rounded-lg border border-ebebeb p-4 shadow-lg hover:scale-105 transition mb-2 ${
                                        isDeleteClicked ? 'bg-39da00 text-ffffff' : 'bg-ff5151 text-ffffff hover:bg-FF0000'
                                    }`}
                                >
                                    {buttonDelContent}
                                </button>
                            </a>
                            <button className="bg-717171 text-ffffff rounded-lg border border-ebebeb p-4 shadow-lg hover:scale-105 hover:bg-505050 transition"
                                onClick={handleCancel}
                            >
                                ยกเลิก
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}