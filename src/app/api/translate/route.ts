import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

type RequestBody = {
  text: string;
  language: string;
};

const apiKey = process.env.GOOGLE_API_KEY;

export async function POST(request: Request) {
  if (!apiKey) {
    return NextResponse.json({ error: "API key is missing" }, { status: 500 });
  }

  const { text, language }: RequestBody = await request.json();

  const lang = language === "sv" ? "swedish" : "english";

  const promtForAi: string = `
    Give me one translation with max 12 words, only one translation without explanations, of the following text to ${lang} while preserving its meaning, tone, and context:
    "${text.trim()}"
  `;

  try {
    const genAI = new GoogleGenAI({ apiKey });

    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: promtForAi,
      config: {
        candidateCount: 1,
        temperature: 1.2,
      },
    });

    const text = result.text;

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
