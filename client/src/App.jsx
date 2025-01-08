import { useEffect, useState } from "react";
import Avatar from "./components/Avatar/Avatar";
import useSpeechToText from "react-hook-speech-to-text";
import AIResponse from "./components/AiResponse";
import { sendMessage } from "./utils/api";
import NavButtons from "./components/ui/NavButtons";
import VoiceStatus from "./components/ui/VoiceStatus";

function App() {
  const [aiResponse, setAiResponse] = useState([{ name: "", status: false }]);
  const synth = window.speechSynthesis;
  const [voices, setVoices] = useState([]);
  const [isBackground, setIsBackground] = useState("");
  const [IsmouthChar, setIsMouthChar] = useState([]);

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
          setAiResponse((prevResponses) => [
            ...prevResponses,
            { name: response.response },
          ]);
        } catch (error) {
          console.error("Error sending message:", error);
        }
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [interimResult]);

  useEffect(() => {
    if (aiResponse && Array.isArray(aiResponse)) {
      aiResponse.forEach((response, index) => {
        if (response.name !== "" && !response.status) {
          const utterance = new SpeechSynthesisUtterance(response.name);
          setAiResponse((prev) =>
            prev.map((item, i) =>
              i === index ? { ...item, status: true } : item
            )
          );

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
          const character = response.name.split("");
            const uppercaseLetters = character
            .filter(
              (char) =>
                (char >= "A" && char <= "H") || (char >= "a" && char <= "H" || (char == "X" && char == "x"))
            )
            .map((char) => char.toUpperCase());

          setIsMouthChar(uppercaseLetters)
        }
      });
    }
  }, [aiResponse, voices, synth,IsmouthChar]);

  return (
    <main className="min-h-screen bg-white grid grid-col-1  ld:grid-rows-1 lg:grid-cols-5 xl:grid-cols-12 gap-2 p-2">
      <section
        className={`relative   row-span-3  border rounded-md bg-green-400 lg:col-span-3 xl:col-span-6`}
        style={{ backgroundColor: isBackground }}
      >
        <Avatar IsmouthChar={IsmouthChar}  stopSpeechToText={stopSpeechToText} />

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
