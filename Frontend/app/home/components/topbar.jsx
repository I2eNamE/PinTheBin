import React, { useState } from "react";
import { MdMenu } from "react-icons/md";
import "./style.css";

export const Topbar = ({ isSidebarOpen, toggleSidebar }) => {
  // const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // const toggleSidebar = () => {
  //   setIsSidebarOpen(!isSidebarOpen);
  // };

  return (
    <div className={`topbar bg-f4f4f4 sm:w-full md:w-1/3 rounded-bl-xl rounded-br-xl ${isSidebarOpen ? "sidebar-open" : ""}`}>
      <div className="px-2 py-2">
        <div className="bg-ffffff rounded-xl px-2 py-2 w-full flex justify-between items-center">
          {/* Menu Button */}
          <button className="hover:scale-105 transition" onClick={toggleSidebar}>
            <MdMenu size={40}/>
          </button>
          {/* Add some space by using | */}
          <div className="divider px-2">|</div>
          {/* Search Bar */}
          <div className="flex flex-grow bg-white items-center">
            <input
              type="text"
              placeholder="ค้นหาถังขยะใกล้เคียง"
              className="font-NotoSansThai outline-none px-2 py-3 rounded-xl w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
