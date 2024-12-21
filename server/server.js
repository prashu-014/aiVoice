const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express();
const port = 5002;

require("dotenv").config();

// const corsOptions ={
//   origin: process.env.FRONTEND_URL,
//   method:["GET","POST"],
//   allowHeaders:["Content-Type","Authorization"],

// }

// console.log(process.env.API_PROMPT)

app.use(cors());

app.use(express.json());

app.post('/aiResponse', async (req, res) => {
  const interimResult = req.body.message;


  console.log(interimResult);
  

  if (!interimResult) {
    return res.status(400).json({ error: "No interim result provided" });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });


    const Prompt = `${process.env.API_PROMPT}
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
    let result = await chat.sendMessage(Prompt);
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
