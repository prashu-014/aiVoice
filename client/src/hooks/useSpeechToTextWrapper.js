import useSpeechToText from "react-hook-speech-to-text";

const useSpeechToTextWrapper = () => {
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  return { error, interimResult, isRecording, results, startSpeechToText, stopSpeechToText };
};

export default useSpeechToTextWrapper;
