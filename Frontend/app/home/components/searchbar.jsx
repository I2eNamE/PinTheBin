import React from 'react';
import { bindetaildata } from '../data/bindetaildata';
import { MdPinDrop } from 'react-icons/md';
import { BiTrash } from 'react-icons/bi';
import './style.css'


export const SearchBar = ({ onLocationClick }) => {
  const handleLocationClick = () => {
    // Get the location data from bindetaildata (assuming it's the first item)
    const locationData = bindetaildata[0];

    // Call the provided callback
    onLocationClick(locationData.position);
    
  };
  // Assuming there's only one item in bindetaildata array
  const binData = bindetaildata[0];

  // Map bin types to their respective icons
  const binTypeIcons = {
    BlueBin: 'https://cdn.discordapp.com/attachments/1154651284788498432/1156152186888273990/20a522e89526bd9d889d2a570fda2948.png?ex=651bd721&is=651a85a1&hm=e21908fd0c1647b838260de08aed7fb7ec0a76d93bb7b307e9dc804489960346&',
    YellowBin: 'https://cdn.discordapp.com/attachments/1154651284788498432/1156152187202830367/9859a7c4b0e307fa5d55ddfc4d97679a.png?ex=651bd721&is=651a85a1&hm=d48fd03b17fad5c39787144c4e2795bf14905e88444c5566350d9aa9a2c4bd3d&',
    GreenBin: 'https://cdn.discordapp.com/attachments/1154651284788498432/1156152187483856906/163b9a57eaf7ed13cb311439a2a5c767.png?ex=651bd721&is=651a85a1&hm=94bd1959868aaf313f64246bff5153530485770907bb13b4cb2e9bde7e5e15da&',
    RedBin: 'https://cdn.discordapp.com/attachments/1154651284788498432/1156152187790032906/0c4a49775dc880df82c1facb6ddfde78.png?ex=651bd721&is=651a85a1&hm=081306ab52d57054033f1f0d752a29a82f1b730d87371002b4675eb75bbd9708&',
  };

  // Filter bin types with true values
  const activeBinTypes = Object.keys(binData)
    .filter(binType => binData[binType] === true);

  return (
    <div className="bg-f4f4f4 rounded-xl font-NotoSansThai">
      <div className="p-2 mt-1">
        <div className="searchitem bg-ffffff rounded-xl shadow-xl relative hover:scale-95 transition cursor-pointer" onClick={handleLocationClick}>
          {/* Bin Data Section */}
          <div className="w-full h-full">
            {/* Display bin data in the innermost div */}
            <div className="p-2">
              <div className="flex justify-start items-center">
                <p className="text-xl font-semibold pl-2">{binData.description}</p>
              </div>
              <p className="bin-location mt-2 ml-5 mr-5 text-lg text-717171">{binData.location}</p>
            </div>

            {/* Bin Type Icons */}
            <div className="flex justify-end items-center p-4">
              {activeBinTypes.map(binType => (
                <img
                  key={binType}
                  src={binTypeIcons[binType]}
                  alt={`${binType} icon`}
                  className="mr-2"
                  style={{ width: '25px', height: '25px' }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
