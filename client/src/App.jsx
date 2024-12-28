import { useEffect, useState } from "react";
import Avatar from "./components/Avatar/Avatar";
import useSpeechToText from "react-hook-speech-to-text";
import AIResponse from "./components/AiResponse";
import { sendMessage } from "./utils/api";
import NavButtons from "./components/ui/NavButtons";
import VoiceStatus from "./components/ui/VoiceStatus";

function App() {
  const [aiResponse, setAiResponse] = useState("");
  const synth = window.speechSynthesis;
  const [voices, setVoices] = useState([]);
  const [isBackground, setIsBackground] = useState("");

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

  if (error) return <p>Web Speech API is not available in this browser 🤷‍</p>;

  useEffect(() => {
    const getVoices = () => {
      const voicesList = synth.getVoices();
      setVoices(voicesList);
    };

    getVoices();
    synth.onvoiceschanged = getVoices;
  }, [synth]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (interimResult) {
        try {
          const response = await sendMessage(interimResult);
          setAiResponse(response);
        } catch (error) {
          console.error("Error sending message:", error);
        }
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [interimResult]);

  useEffect(() => {
    if (aiResponse) {
      const utterance = new SpeechSynthesisUtterance(aiResponse);

      if (voices.length > 0) {
        utterance.voice = voices[2] || voices[0];
      }

      utterance.onstart = () => {
        stopSpeechToText();
      };

      utterance.onend = () => {
        startSpeechToText();
      };

      synth.speak(utterance);
      setAiResponse("");
    }
  }, [aiResponse, voices, synth]);

  return (
    <main className="h-screen bg-white grid grid-col-1 md:grid-cols-5 lg:grid-cols-12 gap-2 p-2">
      <section
        className={`relative md:h-full border rounded-md bg-green-400 md:col-span-3 lg:col-span-6`}
        style={{ backgroundColor: isBackground }}
      >
        <Avatar />

        <VoiceStatus isRecording={isRecording} />
        <NavButtons
          isRecording={isRecording}
          startSpeechToText={startSpeechToText}
          stopSpeechToText={stopSpeechToText}
          setIsBackground={setIsBackground}
          isBackground={isBackground}
        />
      </section>

      <AIResponse
        aiResponse={aiResponse}
        results={results}
        interimResult={interimResult}
      />
    </main>
  );
}

export default App;
