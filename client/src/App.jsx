import { useEffect, useState } from "react";
import Avatar from "./components/Avatar/Avatar";
import ToggleButton from "./components/ToggleButton";
import useSpeechToText from "react-hook-speech-to-text";
import AIResponse from "./components/AiResponse";
import { sendMessage } from "./utils/api"; 

function App() {
  const [aiResponse, setAiResponse] = useState("");
  const synth = window.speechSynthesis;
  const [voices, setVoices] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: false,
    useLegacyResults: false,
  });

  if (error) return <p>Web Speech API is not available in this browser 🤷‍</p>;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (interimResult) {
        console.log("text to sent server..." + interimResult);

        sendMessage(interimResult, setAiResponse);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [interimResult]);

  useEffect(() => {
    if (aiResponse) {
      const utterance = new SpeechSynthesisUtterance(aiResponse);
      utterance.voice = synth.getVoices()[2];

      utterance.onstart = () => {
        setIsSpeaking(true);
        stopSpeechToText();
      };
      utterance.onend = () => {
        setIsSpeaking(false);
        startSpeechToText();
      };
      synth.speak(utterance);
    }
  }, [aiResponse, voices, synth]);

  return (
    <main className="h-screen bg-white grid grid-cols-1 grid-rows-2 xl:grid-rows-1 xl:grid-cols-5 gap-2 p-2">
      <section className="relative border border-green-600 rounded-xl xl:col-span-2 bg-green-400 overflow-hidden">
        <Avatar />
        <ToggleButton
          isRecording={isRecording}
          startSpeechToText={startSpeechToText}
          stopSpeechToText={stopSpeechToText}
        />
      </section>
      <section className="xl:col-span-3 p-4">
        <AIResponse
          aiResponse={aiResponse}
          results={results}
          interimResult={interimResult}
        />
      </section>
    </main>
  );
}

export default App;
