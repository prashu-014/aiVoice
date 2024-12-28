function AIResponse({ aiResponse, results, interimResult }) {  
  return (
    <section className="p-2 md:col-span-2 lg:col-span-6">
      <h2 className="text-lg font-bold">AI Response:</h2>
      <p className="bg-gray-100 text-black p-2 rounded">
        {aiResponse ? aiResponse : "No AI response yet."}
      </p>
      <ul>
        {results &&
          results.map((result) => (
            <li className="bg-green-300 p-1 my-1" key={result.timestamp}>
              {result.transcript}
            </li>
          ))}
        {interimResult && (
          <li className="bg-green-300 p-1 my-1">{interimResult}</li>
        )}
      </ul>
    </section>
  );
}

export default AIResponse;
