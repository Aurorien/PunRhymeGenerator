"use client";

import { SetStateAction, useState } from "react";
import Image from "next/image";
import grangren1 from "../../public/grangren1.png";
import grangren2 from "../../public/grangren2.png";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      setResponse(data.text || "No response received");
    } catch (error) {
      console.error("Error:", error);
      setResponse("Failed to generate response.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setPrompt(e.target.value);

    // Resets the response when user starts typing
    if (response) {
      setResponse("");
    }
  };

  return (
    <div className="flex justify-center min-h-screen">
      <div className="relative flex flex-col items-center align-center space-y-4 w-[500px] ml-14">
        <div className="text-center mt-40 bg-pinegren/90 shadow-[0_0_5px_3px_rgba(42,54,42,0.9)] rounded-lg p-2 w-[300px]">
          <h1 className="text-2xl font-bold">Ordvitsrim-generator</h1>
          <p>Skriv föremålet för rim:</p>
          <input
            value={prompt}
            onChange={handleInputChange}
            placeholder="Skriv här..."
            className="border rounded p-2 w-full max-w-md"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className={`z-50 px-4 py-2 bg-darkpinegren text-white rounded hover:bg-darkpinegren/95 disabled:bg-gray-400 ${
            loading ? "cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Genererar..." : "Generera"}
        </button>

        <div className="flex w-full max-w-screen-lg">
          <p
            className={`absolute top-[420px] left-28 ml-2 p-2 rounded w-64 text-white bg-pinegren shadow-[0_0_5px_3px_rgba(42,54,42,0.9)] py-2 transition-opacity duration-1000`}
          >
            {response}
          </p>
          <Image
            src={grangren1}
            alt="grangren1"
            className={`absolute top-[300px] left-8 transition-opacity duration-2000 ${
              response ? "opacity-0" : "opacity-100"
            }`}
            width={270}
            height={270}
            layout="intrinsic"
          />
          <Image
            src={grangren2}
            alt="grangren2"
            className={`absolute top-[300px] right-8 transition-opacity duration-1000 ${
              response ? "opacity-0" : "opacity-100"
            }`}
            width={270}
            height={270}
            layout="intrinsic"
          />
        </div>
      </div>
    </div>
  );
}
