import "./App.css";
import Avatar from "./components/Avatar";
import useSpeechToText from "react-hook-speech-to-text";
import ToggleButton from "./components/ToggleButton";
import { useEffect, useState,useRef } from "react";
import axios from "axios";

function App() {
  const [aiResponse, setAiResponse] = useState("");

  const [audioUrl, setAudio] = useState("");
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef(null);

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

  const sendMessage = async () => {
    try {
      const response = await axios.post("http://localhost:5000/aiResponse", {
        interimResult,
      });
      if (response.data.success && response.data.audio) {
        const audioBase64 =
          "data:audio/wav;base64," + response.data.audio?.audio_data;
        setAudio(audioBase64);
        setAiResponse(response.data.response);

      } else {
        // setErrorMessage("Failed to generate AI response.");
      }
    } catch (error) {
      console.error("Error:", error);
      setAiResponse("Failed to fetch AI response.");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (interimResult && !isAudioPlaying) {
        sendMessage(interimResult);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [interimResult,isAudioPlaying]);


  const handleAudioPlay = () => {
    setIsAudioPlaying(true);
    stopSpeechToText(); 
  };

  const handleAudioEnded = () => {
    setIsAudioPlaying(false);
    startSpeechToText(); 
  };


  return (
    <main className="h-screen bg-white grid grid-cols-1 grid-rows-2 xl:grid-rows-1 xl:grid-cols-5 gap-2 p-2 ">
      <section className="relative border border-green-600 rounded-xl xl:col-span-2 bg-green-400 overflow-hidden">
        <Avatar />

        <ToggleButton
          isRecording={isRecording}
          startSpeechToText={startSpeechToText}
          stopSpeechToText={stopSpeechToText}
        />
      </section>
      <section className="xl:col-span-3">
        <h2 className="text-lg font-bold">AI Response:</h2>
        <p className="bg-gray-100 text-black p-2 rounded"> {aiResponse}</p>
        <ul>
          {results.map((result) => (
            <li className="bg-green-300 p-1 my-1" key={result.timestamp}>
              {result.transcript}
            </li>
          ))}
          {interimResult && (
            <li className="bg-green-300 p-1 my-1">{interimResult}</li>
          )}
        </ul>
        <div>
          <h1>audion file</h1>
          {audioUrl && (
            <audio
              ref={audioRef}
              controls
              autoPlay
              key={audioUrl}
              onPlay={handleAudioPlay}
              onEnded={handleAudioEnded}
            >
              <source src={audioUrl} type="audio/wav" />
              Your browser does not support the audio element.
            </audio>
          )}
        </div>
      </section>
    </main>
  );
}

export default App;
