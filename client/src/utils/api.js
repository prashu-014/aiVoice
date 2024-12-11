import axios from "axios";

export const sendMessage = async (message, setAiResponse) => {
  if (!message) return;

  try {
    const response = await axios.post("http://localhost:5000/aiResponse", {
      message,
    });

    if (response.data.success) {
      setAiResponse(response.data.response);
    } else {
      setAiResponse("Failed to generate AI response.");
    }
  } catch (error) {
    console.error("Error:", error);
    setAiResponse("Failed to fetch AI response.");
  }
};
