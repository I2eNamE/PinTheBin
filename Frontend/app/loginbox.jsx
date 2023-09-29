'use client'

import axios from "axios";
import React from "react";
import { useState } from "react";

export const LoginBox = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    axios.post("http://tapanawat.myftp.org:8080/login", {
      email: email,
      password: password,
    }).then((response) => {
      console.log(response.data);
      // if(response.data.status == 200){
      //   window.location.href = "/home";
      // }
    }
    ).catch((error) => {
      console.log(error);
    }
    );
  }

  return (
    <div className='bg-ffffff rounded-xl shadow-lg p-8 w-96 m-3 font-NotoSansThai font-medium'>
        <div className="text-center mb-3">
          <h2 className="text-3xl">เข้าสู่ระบบด้วยอีเมล</h2>
        </div>
        <form>
          <div className="mb-4">
            <label htmlFor="email" className="block text-xl text-gray-600">อีเมล</label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border border-ebebeb rounded-xl focus:outline-none bg-f4f4f4 font-normal"
              placeholder="อีเมล"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-xl text-gray-600">รหัสผ่าน</label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border border-ebebeb rounded-xl focus:outline-none bg-f4f4f4 font-normal"
              placeholder="รหัสผ่าน"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="text-right mb-4">
            <a href="/forgot" className="text-505050 hover:underline">ลืมรหัสผ่าน</a>
          </div>
          <div className="text-center">
            <button
              type="button"
              className="w-full px-4 py-4 mb-3 text-xl text-ffffff rounded-xl bg-717171 hover:scale-105 transition-all"
              onClick={handleLogin}
            >
              เข้าสู่ระบบ
            </button>
          </div>
          <div className="text-center pt-2">
            <p>ยังไม่มีบัญชี? <a href="/register" className="text-505050 hover:underline">สร้างบัญชีที่นี่</a></p>
          </div>
          <div className='font-NotoSansThai py-1 text-center'>
            <a href='/home' className='text-xs text-bdbdbd hover:text-FF0000'>This is under development.</a>
          </div>
        </form>
      </div>
  );
};
