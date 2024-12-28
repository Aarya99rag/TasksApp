import React from "react";

const EmptyCard = ({ imgSrc, message }) => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative "><br />
        <img src={imgSrc} alt="No notes" className=" w-full h-auto" />
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="p-2  text-black font-medium bg-white bg-opacity-80 p-4 rounded-md">
            {message}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyCard;
