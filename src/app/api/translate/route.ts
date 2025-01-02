import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

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
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        candidateCount: 1,
        temperature: 1.2,
      },
    });

    const result = await model.generateContent(promtForAi);

    const text = await result.response.text();

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
