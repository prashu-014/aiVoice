import axios from "axios";

export const sendMessage = async (message, setAiResponse) => {
  if (!message) return;

  const URL = import.meta.env.VITE_BACKEND_URL;

  try {
<<<<<<< HEAD
    const response = await axios.post(`${URL}/aiResponse`, 
      {
=======
    const response = await axios.post("process.env.BACKEND_URI/aiResponse", {
>>>>>>> f85c0d524b9b02637490863386d24960e13d5a95
      message,
    }
      );

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
