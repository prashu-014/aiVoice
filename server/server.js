const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();
const app = express();
const port = 5000;
const axios = require("axios");
const { execFile } = require("child_process");
const fs = require("fs");
const path = require("path");
const textToSpeech = require('@google-cloud/text-to-speech');
const util = require('util');
const client = new textToSpeech.TextToSpeechClient();

app.use(cors());
app.use(express.json());

app.post("/aiResponse", async (req, res) => {
  const { interimResult } = req.body;

  console.log("Received input from client:", interimResult);

  if (!interimResult) {
    return res.status(400).json({ error: "No interim result provided" });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `
    
    
            You are "Clara," a personal chatbot designed to assist users with productivity, learning, and creative ideas. Your responses should embody the following characteristics:
            1. **Tone and Style**: Maintain a friendly, supportive, and professional tone in all interactions. Use language that is clear, concise, and meaningful.

        2. **Response Structure**: 
              simple text format

        3. **Adaptability**: 
           - Tailor your language and formality level based on the user's cues, whether they are informal or formal.
           - Recognize context cues in the user's messages to adjust your responses accordingly.

        4. **Content Focus**: 
           - Provide assistance, suggestions, and help when users ask for personal information or guidance.
           - Ensure that all advice and suggestions are actionable and relevant to the user's needs.

        5. **Knowledge Limitations**: 
           - You are trained on data up to October 2023. If asked about events or developments beyond this date, politely inform the user of your knowledge cut-off.

        6. **Engagement Style**: 
           - Encourage user interaction by asking follow-up questions when appropriate, but avoid overwhelming them with too many choices.
           - Always conclude responses with an invitation for further questions or assistance.

        Your ultimate goal is to enhance the user's experience by being a reliable and responsive assistant.
              User Input: ${interimResult}
              Respond appropriately to the user's query   response in simple text format and short.
    `;

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "Hello" }],
        },
        {
          role: "model",
          parts: [{ text: "Great to meet you. What would you like to know?" }],
        },
      ],
    });
    let result = await chat.sendMessage(prompt);

    const chatResponse = result.response.text();

    if (!chatResponse) {
      throw new Error("Chat response is undefined or empty.");
    }

    console.log(chatResponse);
    

    const audioUrl = await getVoice(chatResponse);

    console.log("audio url ",audioUrl);
    

    
    // const lipSyncData = await runRhubarbBase64(audioUrl);
    // console.log(lipSyncData);
    

    res.status(200).json({
      success: true,
      response: chatResponse,
      // audio: audioUrl    
    });
  } catch (error) {
    console.error("Error generating AI response:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to generate AI response",
      error: error.message,
    });
  }
});

// const getVoice = async (text) => {

//   console.log("text....", text);
  
//   const options = {
//     method: "POST",
//     url: process.env.SPEECHIFY_URL,
//     headers: {
//       accept: "*/*",
//       "content-type": "application/json",
//       Authorization: `Bearer ${process.env.SPEECHIFY_API}`,
//     },
//     data: {
//       audio_format: "wav",
//       input: text,
//       model: "simba-base",
//       options: { loudness_normalization: true },
//       voice_id: "Lisa",
//     },
//   };

//   try {
//     const response = await axios.request(options);
//     // console.log("Audio generated:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error(
//       "Error generating audio:",
//       error.response?.data || error.message
//     );
//     throw new Error("Audio generation failed.");
//   }
// };


// const saveBase64Audio = (base64Audio, outputPath) => {
  
//   const base64Data = base64Audio.replace(/^data:audio\/wav;base64,/, "");
//   fs.writeFileSync(outputPath, base64Data, "base64");
// };






const runRhubarbBase64 = (audioBase64) => {

  return new Promise((resolve, reject) => {
    const rhubarbExecutable = "rhubarb"; // Ensure Rhubarb is installed and accessible in your PATH
    const args = ["-o", "-", "--format", "json"]; // Output as JSON to stdout

    // Decode base64 audio
    let buffer;
    try {
      console.log("base64 text ....",audioBase64);
      
      buffer = Buffer.from(audioBase64, "base64");
    } catch (error) {
      return reject("Invalid base64 audio data.");
    }

    // Execute Rhubarb
    const child = execFile(rhubarbExecutable, args, (error, stdout, stderr) => {
      if (error) {
        return reject(`Rhubarb execution failed: ${stderr || error.message}`);
      }
      resolve(stdout); // Resolve with JSON output
    });

    // Pass the audio buffer to Rhubarb's stdin
    child.stdin.write(buffer);
    child.stdin.end();
  });
};





app.get("/", (req, res) => {
  res.send("Server is running successfully!");
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
