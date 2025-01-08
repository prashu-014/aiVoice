import axios from "axios";

export const sendMessage = async (message) => {
  if (!message) return;

  const URL = import.meta.env.VITE_BACKEND_URL;

  try {
    const response = await axios.post(`${URL}/aiResponse`, {
      message,
    });

    if (response.data.success) {
      return response.data;
    }
  } catch (error) {
    alert("Error:", error)
  }
};
