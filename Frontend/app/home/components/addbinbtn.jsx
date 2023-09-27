import React from 'react';

export const AddBinBtn = () => {
  return (
    <div className="flex justify-center">
      <button
        type="button"
        className="bg-ffffff text-white rounded-full p-5 shadow-lg font-NotoSansThai font-medium text-xl hover:scale-105 hover:bg-ebebeb transition-all"
      >
        <img
          src="https://cdn.discordapp.com/attachments/1154651284788498432/1154651372743041035/Add_Trash.png"
          className="inline-block w-10 h-10"
          alt="Add Trash"
        />
      </button>
    </div>
  );
};
