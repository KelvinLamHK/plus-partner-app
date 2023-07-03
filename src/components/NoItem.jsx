import React from "react";
import BlankSlateImage from "../img/BlankSlateImage.svg";

const NoItem = () => {
  return (
    <div className="text-center	">
                <img
                  alt="Noitem"
                  src={BlankSlateImage}
                  className="w-fit "
                />
                <span className="text-gray-400 ">No items to show</span>
    </div>
  );
};

export default NoItem;