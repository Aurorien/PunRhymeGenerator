import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

type RequestBody = {
  prompt: string;
};

const apiKey = process.env.GOOGLE_API_KEY;

export async function POST(request: Request) {
  if (!apiKey) {
    return NextResponse.json({ error: "API key is missing" }, { status: 500 });
  }

  const { prompt }: RequestBody = await request.json();

  console.log("prompt", prompt);

  const promtForAi: string = `Give me one, and only one without explanations, rhyme for the item which is "${prompt}", in swedish in the style of a swedish christmas gift rhyme and also a pun (not anti-pun). It should be max 12 words and should not mention the item. The pun should, keep in context. Also it should be in a tone of kind children farytale. Also it should not mention any of the three items most closely related to the item to the item. Words and variants of them that should never be used: dold, hemlighet, jud, lovar, skärpt, annars, skylla, troll, trollen, mysterium, svag, små, far, mor, syster, bror, kusin, dig, ditt, din, strid, porr, sex. The rhyme have to do with ${prompt} and it is important that it rhyme in swedish and make it a swedish pun`;

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
