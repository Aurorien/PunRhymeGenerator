import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

type RequestBody = {
  prompt: string;
  language: string;
};

const apiKey = process.env.GOOGLE_API_KEY;

export async function POST(request: Request) {
  if (!apiKey) {
    return NextResponse.json({ error: "API key is missing" }, { status: 500 });
  }

  const { prompt, language }: RequestBody = await request.json();

  const lang = language === "sv" ? "swedish" : "english";

  console.log("prompt", prompt);

  const promtForAi: string = `Give me one, and only one without explanations, rhyme for the item which is "${prompt}", in ${lang} in the style of a ${lang} christmas gift rhyme and also a pun (not anti-pun). It should be max 12 words and should not mention the item. The pun should, keep in context. Also it should be in a tone of kind children farytale. Also it should not mention any of the three items most closely related to the item to the item. Words and variants of them that should never be used: dold, hemlighet, jud, lovar, skärpt, annars, skylla, troll, trollen, mysterium, svag, små, far, mor, syster, bror, kusin, dig, ditt, din, strid, porr, sex. Neither any of those words in english. The rhyme have to do with ${prompt} and it is important that it rhyme in ${lang} and make it a ${lang} pun`;

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
