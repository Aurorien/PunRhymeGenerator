import { NextResponse } from "next/server";
import { ApiError, GoogleGenAI } from "@google/genai";
import { errorResponse, geminiErrorResponse } from "@src/lib/apiError";

// Tried in order. Each model has its own free-tier daily quota, so when one
// is used up (or busy), the next one gets a chance.
const MODELS = [
  "gemini-2.5-flash-lite",
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
  "gemini-2.5-flash",
];

// 429 = quota used up, 503 = overloaded, 404 = model not available (anymore).
const TRY_NEXT_MODEL = [429, 503, 404];

async function generateWithFallback(apiKey: string, contents: string) {
  const genAI = new GoogleGenAI({ apiKey });
  let lastError: unknown;

  for (const model of MODELS) {
    try {
      return await genAI.models.generateContent({
        model,
        contents,
        config: {
          candidateCount: 1,
          temperature: 1.2,
        },
      });
    } catch (error) {
      if (error instanceof ApiError && TRY_NEXT_MODEL.includes(error.status)) {
        console.warn(`${model} failed with ${error.status}, trying next model`);
        lastError = error;
        continue;
      }
      throw error;
    }
  }

  // Every model failed: throw the last error so the route reports it.
  throw lastError;
}

export const languageName = (language: string) =>
  language === "sv" ? "swedish" : "english";

// Sends a finished prompt to Gemini and turns the result into a response:
// { text } on success, or { errorCode } the frontend can show a message for.
export async function askGemini(prompt: string) {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error("GOOGLE_API_KEY is missing");
    return errorResponse("generic", 500);
  }

  try {
    const result = await generateWithFallback(apiKey, prompt);

    if (!result.text) {
      console.error(
        "Empty response from Gemini:",
        result.candidates?.[0]?.finishReason,
        result.promptFeedback
      );
      return errorResponse("noResponse", 502);
    }

    return NextResponse.json({ text: result.text });
  } catch (error) {
    return geminiErrorResponse(error);
  }
}
