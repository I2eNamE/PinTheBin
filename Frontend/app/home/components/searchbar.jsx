import React from 'react';
import { bindetaildata } from '../data/bindetaildata';
import { MdPinDrop } from 'react-icons/md';

export const SearchBar = () => {
  return (
    <div className="bg-f4f4f4 sm:w-full md:w-1/3 rounded-xl">
      <div className="p-4 mt-1 shadow-xl">
        <div className="bg-ffffff rounded-xl shadow-xl">
          {bindetaildata.map((item, index) => (
            <div key={index} className="flex items-center">
              {/* <img src={item.picture} alt="Location" className="w-20 h-20 rounded-full mr-4" /> */}
              <div>
                <div>
                    <MdPinDrop size={30} color="#505050" />
                    <h3 className="text-xl font-bold">{item.location}</h3>
                </div>

                <p className="text-gray-500">{item.description}</p>
                {/* <p className="text-gray-500">Timestamp: {item.timestamp}</p> */}
                {/* <p className="text-gray-500">Position: Lat {item.position.lat}, Lng {item.position.lng}</p> */}
                {/* Render other information as needed */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
