'use client'

import React, { useState, useEffect } from 'react';

export const ToggleButtons = ({ onButtonStateChange, initialButtonStates }) => {
  const buttonColors = {
    blue_bin: 'bg-0021f5',
    yellow_bin: 'bg-ffc82f',
    green_bin: 'bg-00ab15',
    red_bin: 'bg-dd3327',
  };

  // Define buttonStates using useState
  const [buttonStates, setButtonStates] = useState({
    blue_bin: {
        active: false,
        icon: 'https://media.discordapp.net/attachments/1154651284788498432/1156152186888273990/20a522e89526bd9d889d2a570fda2948.png',
        activeIcon: 'https://media.discordapp.net/attachments/1154651284788498432/1156154999806631966/Disposal.png?ex=6513f0c0&is=65129f40&hm=f4b1089811a29c23c707f3df5aa85651670a81170b120480cb716f59346fbfc2&=&width=120&height=120',
        title: 'ขยะทั่วไป'
      },
      yellow_bin: {
        active: false,
        icon: 'https://media.discordapp.net/attachments/1154651284788498432/1156152187202830367/9859a7c4b0e307fa5d55ddfc4d97679a.png',
        activeIcon: 'https://media.discordapp.net/attachments/1154651284788498432/1156155000054087710/Recycle.png?ex=6513f0c0&is=65129f40&hm=eeea0c0dcd45bc74067ee5b661490ffdb6c073463c7e448c7e8b76f451e6ee72&=&width=120&height=120',
        title: 'ขยะรีไซเคิล'
      },
      green_bin: {
        active: false,
        icon: 'https://media.discordapp.net/attachments/1154651284788498432/1156152187483856906/163b9a57eaf7ed13cb311439a2a5c767.png',
        activeIcon: 'https://cdn.discordapp.com/attachments/1154651284788498432/1156160182284451911/Fish_Skeleton_1.png?ex=6513f593&is=6512a413&hm=d873b9b268a8b4eec36cc7ef0be0c86fcf3dbd4f6ca0a84a4d300b1ceebeef6b&=&width=168&height=167',
        title: 'ขยะเปียก'
      },
      red_bin: {
        active: false,
        icon: 'https://media.discordapp.net/attachments/1154651284788498432/1156152187790032906/0c4a49775dc880df82c1facb6ddfde78.png',
        activeIcon: 'https://media.discordapp.net/attachments/1154651284788498432/1156155000540635196/Skull.png?ex=6513f0c0&is=65129f40&hm=52c0fbb3df4e79bbd104aeb72cb167fe5a458834efe541e45d2db6c10290354f&=&width=98&height=98',
        title: 'ขยะอันตราย'
      },
  });

  const setInitialButtonStates = (initialStates) => {
    if (initialStates && typeof initialStates === 'object') {
      setButtonStates((prevState) => {
        const newState = { ...prevState };
  
        Object.keys(newState).forEach((binType) => {
          newState[binType].active = initialStates[binType] || false;
        });
  
        return newState;
      });
    }
  };
  

  useEffect(() => {
    setInitialButtonStates(initialButtonStates);
  }, [initialButtonStates]);

  // Function to handle button toggle
  const handleButtonClick = (buttonName) => {
    setButtonStates((prevState) => ({
      ...prevState,
      [buttonName]: {
        ...prevState[buttonName],
        active: !prevState[buttonName].active,
      },
    }));
  };

  useEffect(() => {
    onButtonStateChange(buttonStates);
  }, [buttonStates, onButtonStateChange]);
    
  console.log('initialButtonStates:', initialButtonStates);

  return (
    <div className="grid grid-cols-2 gap-4">
      {Object.entries(buttonStates).map(([buttonName, buttonState]) => (
        <button
          key={buttonName}
          onClick={() => handleButtonClick(buttonName)}
          className={`relative rounded-lg p-2 border border-c9c9c9 flex flex-col items-center justify-center hover:scale-105 transition ${
            buttonState.active ? `${buttonColors[buttonName]} text-ffffff` : 'bg-ffffff text-black'
          }`}
        >
          {buttonState.active && (
            <img
              src="https://media.discordapp.net/attachments/1154651284788498432/1156160485025120336/405bcae6a8367d49f44c04d4362d7340.png?ex=6513f5dc&is=6512a45c&hm=346a5415f0b333b0aac6f08cad2d79b4a66bf092b428eb9bc47ed9abab789411&=&width=120&height=120"
              alt={`${buttonName}-extra`}
              className="absolute top-0 right-0 w-6 h-6"
            />
          )}
          <img
            src={buttonState.active ? buttonState.activeIcon : buttonState.icon}
            alt={buttonName}
            className="w-12 h-12 mb-2"
          />
          {buttonState.title}
        </button>
      ))}
    </div>
  );
};