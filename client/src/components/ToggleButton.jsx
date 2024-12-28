import React from "react";
import { FaRegCirclePlay } from "react-icons/fa6";
import { MdOutlineStopCircle } from "react-icons/md";

const ToggleButton = ({ isRecording, stopSpeechToText, startSpeechToText }) => {
  return (
    <div
      className="flex gap-1 shadow-lg items-center  rounded-full transition-all ease-in "
      onClick={isRecording ? stopSpeechToText : startSpeechToText}
    >
      <button className="p-1">
        {isRecording ? (
          <MdOutlineStopCircle className="text-4xl md:text-5xl text-red-500" />
        ) : (
          <FaRegCirclePlay className="text-4xl md:text-5xl text-green-800  " />
        )}
      </button>
    </div>
  );
};

export default ToggleButton;
