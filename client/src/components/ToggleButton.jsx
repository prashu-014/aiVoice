import React from "react";
import { FaRegCirclePlay } from "react-icons/fa6";
import { MdOutlineStopCircle } from "react-icons/md";

const ToggleButton = ({ isRecording, stopSpeechToText, startSpeechToText }) => {
  return (
    <div className="absolute top-3 left-2  flex gap-1 items-center rounded-md bg-white min-w-28 transition-all ease-in">
      <button
        onClick={isRecording ? stopSpeechToText : startSpeechToText}
        className=" p-1"
      >
       
        {isRecording ? (
          <MdOutlineStopCircle className=" text-2xl text-red-600 " />
        ) : (
          <FaRegCirclePlay className="text-2xl text-green-800 " />
        )}
      </button>
      <h1>{isRecording.toString() === 'false' ? "Start" :" Listening..." }</h1>
    </div>
  );
};

export default ToggleButton;
