import { NextResponse } from "next/server";
import { ApiError } from "@google/genai";

export type ErrorCode =
  | "dailyLimit"
  | "rateLimit"
  | "overloaded"
  | "noResponse"
  | "generic";

export function errorResponse(code: ErrorCode, status: number) {
  return NextResponse.json({ errorCode: code }, { status });
}

// Turns an error from the Gemini SDK into a response with an error code
// the frontend can show a translated message for.
export function geminiErrorResponse(error: unknown) {
  console.error("Gemini error:", error);

  if (error instanceof ApiError) {
    if (error.status === 429) {
      const isDaily = error.message.includes("PerDay");
      return errorResponse(isDaily ? "dailyLimit" : "rateLimit", 429);
    }
    if (error.status === 503) {
      return errorResponse("overloaded", 503);
    }
  }

  return errorResponse("generic", 500);
}
