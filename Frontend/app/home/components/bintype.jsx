import React from "react";

const BinTypes = ({ bins }) => {
  const binTypes = [
    { key: 'BlueBin', title: 'ขยะทั่วไป' },
    { key: 'YellowBin', title: 'ขยะรีไซเคิล' },
    { key: 'GreenBin', title: 'ขยะเปียก' },
    { key: 'RedBin', title: 'ขยะอันตราย' },
  ];

  const binTypeIcons = {
    BlueBin: 'https://media.discordapp.net/attachments/1154651284788498432/1156152186888273990/20a522e89526bd9d889d2a570fda2948.png?ex=65153fa1&is=6513ee21&hm=030509c095ce3d6f3e4dfea6f5cf99f76485f939029e9fbdc585758efea0e81b&=&width=120&height=120',
    YellowBin: 'https://media.discordapp.net/attachments/1154651284788498432/1156152187202830367/9859a7c4b0e307fa5d55ddfc4d97679a.png?ex=65153fa1&is=6513ee21&hm=f97265eca9cc0377467da84a204c066f37590b58b348f0bf498af2260969b5e9&=&width=120&height=120',
    GreenBin: 'https://media.discordapp.net/attachments/1154651284788498432/1156152187483856906/163b9a57eaf7ed13cb311439a2a5c767.png?ex=65153fa1&is=6513ee21&hm=5a8fcc40afef5a4b23edb95122384afca2e85c21840f4760402d23d2d6233465&=&width=125&height=125',
    RedBin: 'https://media.discordapp.net/attachments/1154651284788498432/1156152187790032906/0c4a49775dc880df82c1facb6ddfde78.png?ex=65153fa1&is=6513ee21&hm=f2c9f89ad65efa23310677dae54dfda4c2f77a7c552d33dfe70242130a883623&=&width=125&height=125',
  };

  return (
    <div className="flex justify-center items-center">
      <div className="flex">
        {binTypes.map((binType) => (
          bins[binType.key] && (
            <div key={binType.key} className="flex flex-col items-center justify-between rounded-lg shadow-lg p-2 m-2">
              <img
                src={bins[binType.key].active ? binTypeIcons[binType.key] : binTypeIcons[binType.key]}
                alt={binType.title}
                className="w-8 h-8"
              />
              <p className="text-sm mt-1">{binType.title}</p>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default BinTypes;
