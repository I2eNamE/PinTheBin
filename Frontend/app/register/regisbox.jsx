import React from "react";
import { IoMdArrowRoundBack } from "react-icons/io";

export const RegisterBox = () => {
  return (
    <div className='bg-ffffff rounded-xl shadow-lg p-8 w-96 m-3 font-NotoSansThai font-medium'>
      <div className="flex items-center justify-between mb-3">
        <a href="/"> <button className="text-xl  focus:outline-none hover:scale-110 transition-all">
          <IoMdArrowRoundBack size={40} /></button></a>
        <h2 className="text-3xl">สร้างบัญชีใหม่</h2>
        <div className="w-8"></div> {/* Add an empty div for spacing */}
      </div>
      <form>
        <div className="mb-4">
          <label htmlFor="name" className="block text-xl ">ชื่อ</label>
          <input
            type="text"
            id="name"
            className="w-full px-3 py-2 border border-ebebeb rounded-xl focus:outline-none bg-f4f4f4 font-normal"
            placeholder="ชื่อ"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-xl ">อีเมล</label>
          <input
            type="email"
            id="email"
            className="w-full px-3 py-2 border border-ebebeb rounded-xl focus:outline-none bg-f4f4f4 font-normal"
            placeholder="อีเมล"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-xl ">รหัสผ่าน</label>
          <input
            type="password"
            id="password"
            className="w-full px-3 py-2 border border-ebebeb rounded-xl focus:outline-none bg-f4f4f4 font-normal"
            placeholder="รหัสผ่าน"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-xl ">ยืนยันรหัสผ่าน</label>
          <input
            type="password"
            id="confirmPassword"
            className="w-full px-3 py-2 border border-ebebeb rounded-xl focus:outline-none bg-f4f4f4 font-normal"
            placeholder="ยืนยันรหัสผ่าน"
            required
          />
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="w-full px-4 py-4 mb-3 bg-blue-500 text-xl text-ffffff rounded-xl bg-717171 hover:scale-105 transition-all"
          >
            สร้างบัญชี
          </button>
        </div>
        <div className="text-center pt-2">
          <p>มีบัญชีอยู่แล้ว? <a href="/" className="text-505050 hover:underline">เข้าสู่ระบบที่นี่</a></p>
        </div>
      </form>
    </div>
  );
};
