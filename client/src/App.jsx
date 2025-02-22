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
  const [Ismouthviseme, setIsMouthviseme] = useState([]);

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
            { name: response.response.answer },
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
          let startTime = performance.now();

          utterance.onstart = () => {
            stopSpeechToText();
            startTime = performance.now(); 
          };

          utterance.onend = () => {
            startSpeechToText();    
            setIsMouthviseme([]);
          };
  
          utterance.onboundary = (event) => {
            let endTime = performance.now();
            let audioDuration = (endTime - startTime) / 1000; 
  
            const visemeText = response.name.toUpperCase();
  
            const visemePattern = /[ABCEFGHX]/g;
            const matches = visemeText.match(visemePattern) || [];
  
            const numCharacters = Math.max(matches.length, 1); 
            let timePerChar = Math.max(audioDuration / numCharacters, 0.25); 
  
            let stateArray = [];
            let currentTime = 0;
  
            matches.forEach((viseme) => {
              let endTime = currentTime + timePerChar;
              stateArray.push({ start: currentTime, end: endTime, value: viseme });
              currentTime = endTime;
            });
  
            setIsMouthviseme(stateArray);
          };

          synth.speak(utterance);
        }
      });
    }
  }, [aiResponse, voices, synth]);

  return (
    <main className="h-screen px-2 pt-2 bg-white grid grid-cols-1 grid-rows-2 lg:grid-rows-1 xl:grid-rows-1 lg:grid-cols-5 xl:grid-cols-12 gap-2 overflow-hidden" style={{ background: 'url(/background/background.jpg)',backgroundPosition:'center', backgroundSize:'cover' ,backgroundRepeat:'no-repeat'}}>
      <section
        className={`relative  rounded-md lg:col-span-3 xl:col-span-6 w-full h-full`}
        
        >
        <Avatar stopSpeechToText={stopSpeechToText} Ismouthviseme={Ismouthviseme} />
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
