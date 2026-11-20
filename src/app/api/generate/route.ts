import { askGemini, languageName } from "@src/lib/gemini";

type RequestBody = {
  prompt: string;
  language: string;
};

export async function POST(request: Request) {
  const { prompt, language }: RequestBody = await request.json();
  const lang = languageName(language);

  const promtForAi: string = `Give me one, and only one without explanations, rhyme for the item which is "${prompt}", in ${lang} in the style of a ${lang} christmas gift rhyme and also a pun (not anti-pun). It should be max 12 words and should not mention the item. The pun should, keep in context. Also it should be in a tone of kind children farytale. Also it should not mention any of the three items most closely related to the item to the item. Words and variants of them that should never be used: dold, hemlighet, jud, lovar, skärpt, annars, skylla, troll, trollen, mysterium, svag, små, far, mor, syster, bror, kusin, dig, ditt, din, strid, porr, sex. Neither any of those words in english. The rhyme have to do with ${prompt} and it is important that it rhyme in ${lang} and make it a ${lang} pun`;

  return askGemini(promtForAi);
}
