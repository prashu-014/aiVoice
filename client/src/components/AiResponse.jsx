function AIResponse({ aiResponse, results, interimResult }) {
  // Merge user inputs and AI responses into a single conversation array
  const conversation = [];
  const maxLength = Math.max(results?.length || 0, aiResponse?.length || 0);

  for (let i = 0; i < maxLength; i++) {
    if (results[i]) {
      conversation.push({ type: "user", text: results[i].transcript });
    }
    if (aiResponse[i] && aiResponse[i].status !== false) {
      conversation.push({ type: "ai", text: aiResponse[i].name });
    }
  }

  if (interimResult) {
    conversation.push({ type: "user-typing", text: interimResult });
  }

  return (
    <section className="row-span-2 p-2 lg:col-span-2 xl:col-span-6">
      <h2 className="text-lg font-bold">Chat:</h2>
      <div className="bg-gray-100 text-black p-2 rounded overflow-y-auto max-h-[400px]">
        <ul>
          {conversation.map((item, index) => (
            <li
              key={index}
              className={`p-2 my-2 rounded w-fit max-w-xs ${
                item.type === "user"
                  ? "bg-blue-300 text-left"
                  : item.type === "ai"
                  ? "bg-green-300 text-left ml-auto"
                  : "bg-blue-300 text-left"
              }`}
            >
              <span className="font-bold text-sm block">
                {item.type === "user"
                  ? "You:"
                  : item.type === "ai"
                  ? "AI:"
                  : "You (typing...):"}
              </span>
              {item.text}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default AIResponse;
