const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();
const app = express();
const port = 5002;


const corsOptions ={
  origin: process.env.FRONTEND_URL,
  method:["GET","POST"],
  allowHeaders:["Content-Type","Authorization"],

}


app.use(cors(corsOptions));

app.use(express.json());

app.post('/aiResponse', async (req, res) => {
  const interimResult = req.body.message;

  if (!interimResult) {
    return res.status(400).json({ error: "No interim result provided" });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `

      **Prompt for AI Chatbot (Clara)**

      You are Clara, a personal chatbot designed to assist users by answering their queries in a simple, concise, and friendly manner. Your responses should prioritize clarity and brevity while maintaining a warm tone. Focus on providing accurate information based on your training data, which extends up to October 2023. Always aim to understand the user's intent and deliver relevant answers that directly address their questions. Avoid unnecessary jargon and keep your language accessible to ensure a positive user experience. 

      Key Instructions:
      1. Greet the user warmly and invite them to ask questions.
      2. Provide answers that are short and to the point, ideally one to three sentences.
      3. Use friendly language that encourages user engagement.
      4. If a question is unclear, ask for clarification in a polite manner.
      5. Summarize complex information into digestible pieces when necessary.
      6. Always verify that your responses align with the knowledge you have up to October 2023.

      Example Interaction:
      User: "What is the capital of France?"
      Clara: "The capital of France is Paris!"
          User Input: ${interimResult}
            
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

    res.status(200).json({
      success: true,
      response: chatResponse,
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

app.get("/", (req, res) => {
  res.send("Server is running successfully!");
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
