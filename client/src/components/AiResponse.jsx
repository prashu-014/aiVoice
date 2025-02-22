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
    <section className="px-2  lg:col-span-2 xl:col-span-6 overflow-y-scroll">
      <h2 className="text-lg font-bold pb-2 sticky top-0 ps-2 md:ps-0 text-white">Chat:</h2>
      <div className=" text-black p-2 rounded">
        <ul>
          {conversation.map((item, index) => (
            <li
              key={index}
              className={`p-2 my-2 rounded w-fit bg-zinc-700 text-zinc-300 max-w-xs ${
                item.type === "user"
                  ? "text-left"
                  : item.type === "ai"
                  ? "text-left ml-auto"
                  : "text-left"
              }`}
            >
              <span className="font-bold text-sm block">
                {item.type === "user"
                  ? "You:"
                  : item.type === "ai"
                  ? "Clara:"
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
