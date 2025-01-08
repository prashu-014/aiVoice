import React from "react";

import { MdOutlineKeyboardVoice } from "react-icons/md";
import { HiMiniLanguage } from "react-icons/hi2";

import { GrUserFemale } from "react-icons/gr";
import ToggleButton from "../ToggleButton";

const NavButtons = ({
  isRecording,
  startSpeechToText,
  stopSpeechToText,
  setIsBackground,
  isBackground, 
}) => {
  return (
    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-white z-20 flex gap-4 items-center justify-center px-4 py-1 md:px-10 rounded-full shadow-lg">
      <button className="p-2 bg-green-800 text-white rounded-full flex items-center justify-center md:w-10 md:h-10">
        <HiMiniLanguage />
      </button>
      <button className="p-2  bg-green-800 text-white rounded-full flex items-center justify-center md:w-10 md:h-10">
        <MdOutlineKeyboardVoice />
      </button>

      <ToggleButton
        isRecording={isRecording}
        startSpeechToText={startSpeechToText}
        stopSpeechToText={stopSpeechToText}
      />
      <button className="p-2  bg-green-800 text-white rounded-full flex items-center justify-center md:w-10 md:h-10">
        <GrUserFemale />
      </button>

      <input
        type="color"
        className="h-8 w-8 md:w-10 md:h-10 rounded-full border-0 cursor-pointer"
        onChange={(e) => setIsBackground(e.target.value)}
        value={isBackground}
      />
    </div>
  );
};

export default NavButtons;
