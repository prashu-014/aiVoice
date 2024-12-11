import { useEffect, useState } from "react";

const useTextToSpeech = () => {
  const synth = window.speechSynthesis;
  const [voices, setVoices] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const fetchVoices = () => setVoices(synth.getVoices());
    fetchVoices();

    synth.addEventListener("voiceschanged", fetchVoices);
    return () => synth.removeEventListener("voiceschanged", fetchVoices);
  }, [synth]);

  const speak = (text, voice, onStart, onEnd) => {
    if (text && synth) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voice || voices[0];
      utterance.onstart = () => {
        setIsSpeaking(true);
        onStart && onStart();
      };
      utterance.onend = () => {
        setIsSpeaking(false);
        onEnd && onEnd();
      };
      synth.speak(utterance);
    }
  };

  return { voices, isSpeaking, speak };
};

export default useTextToSpeech;
