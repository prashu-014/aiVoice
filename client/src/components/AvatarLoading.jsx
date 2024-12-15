import React from "react";
import {PuffLoader} from "react-spinners";

const AvatarLoading = () => {
  return (
    <div className=" h-full  w-full flex flex-col items-center justify-center text-white">
      <PuffLoader /> 
      <span className="font-semibold text-white">Loading Model...</span>
    </div>
  );
};

export default AvatarLoading;
