import { askGemini, languageName } from "@src/lib/gemini";

type RequestBody = {
  text: string;
  language: string;
};

export async function POST(request: Request) {
  const { text, language }: RequestBody = await request.json();
  const lang = languageName(language);

  const promtForAi: string = `
    Give me one translation with max 12 words, only one translation without explanations, of the following text to ${lang} while preserving its meaning, tone, and context:
    "${text.trim()}"
  `;

  return askGemini(promtForAi);
}
