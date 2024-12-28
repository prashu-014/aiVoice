import React from "react";

const VoiceStatus = ({ isRecording }) => {
  return (
    <p
      className={`absolute top-2 left-2 text-xs md:text-base px-2 py-1 bg-slate-100 rounded-[4px] font-bold ${
        isRecording ? "text-red-500" : "text-zinc-700"
      }`}
    >
      {isRecording ? "Listening..." : "Recording"}
    </p>
  );
};

export default VoiceStatus;
