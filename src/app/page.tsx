"use client";

import { SetStateAction, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { ErrorCode } from "@src/lib/apiError";
interface LocaleFile {
  title: string;
  inputLabel: string;
  inputPlaceholder: string;
  generateButton: string;
  generateButtonGenerating: string;
  errorDailyLimit: string;
  errorRateLimit: string;
  errorOverloaded: string;
  errorNoResponse: string;
  errorGeneric: string;
}

enum Language {
  Swedish = "sv",
  English = "en",
}

const loadLocale = async (lang: Language): Promise<LocaleFile> =>
  (await import(`../locales/${lang}.json`)).default;

const errorMessage = (locale: LocaleFile, errorCode?: ErrorCode) => {
  switch (errorCode) {
    case "dailyLimit":
      return locale.errorDailyLimit;
    case "rateLimit":
      return locale.errorRateLimit;
    case "overloaded":
      return locale.errorOverloaded;
    case "noResponse":
      return locale.errorNoResponse;
    default:
      return locale.errorGeneric;
  }
};

type ApiResult = { text?: string; errorCode?: ErrorCode };

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const [language, setLanguage] = useState<Language>(Language.Swedish);
  const [translations, setTranslations] = useState<LocaleFile | null>(null);

  const translationCache = useRef<Map<string, string>>(new Map());

  const generateCacheKey = (prompt: string, lang: Language) =>
    `${prompt.trim()}-${lang}`;

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    const loadTranslations = async () => {
      setTranslations(await loadLocale(language));
    };
    loadTranslations();
  }, [language]);

  const handleLanguageChange = async (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);

    if (response) {
      const cacheKey = generateCacheKey(prompt, lang);
      console.log("cacheKey", cacheKey);
      console.log("translationCache", translationCache);
      if (translationCache.current.has(cacheKey)) {
        setResponse(translationCache.current.get(cacheKey)!);
        return;
      }

      try {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: response,
            language: lang,
          }),
        });

        const data: ApiResult = await res.json();
        if (res.ok && data.text) {
          translationCache.current.set(cacheKey, data.text);
          setResponse(data.text);
        } else {
          setResponse(errorMessage(await loadLocale(lang), data.errorCode));
        }
      } catch (error) {
        console.error("Error translating response:", error);
        setResponse(errorMessage(await loadLocale(lang)));
      }
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setRevealed(false);
    const minDelay = new Promise((resolve) => setTimeout(resolve, 2000));

    let newResponse: string;
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, language }),
      });

      const data: ApiResult = await res.json();
      if (res.ok && data.text) {
        const cacheKey = generateCacheKey(prompt, language);
        translationCache.current.set(cacheKey, data.text);
        newResponse = data.text;
      } else {
        newResponse = errorMessage(await loadLocale(language), data.errorCode);
      }
    } catch (error) {
      console.error("Error:", error);
      newResponse = errorMessage(await loadLocale(language));
    }

    await minDelay;
    setResponse(newResponse);
    setRevealed(true);
    setLoading(false);
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
      <div className="absolute right-4 top-4 flex text-end font-bold text-black  bg-lightpinegren/90 shadow-[0_0_5px_3px_rgba(131,174,131,0.9)] rounded-xl">
        <div
          className="m-1 pr-2 border-r-2 border-black cursor-pointer"
          onClick={() => handleLanguageChange(Language.Swedish)}
        >
          sv
        </div>
        <div
          className="mt-1 mr-2 cursor-pointer"
          onClick={() => handleLanguageChange(Language.English)}
        >
          en
        </div>
      </div>
      <div className="relative flex flex-col items-center align-center  w-[500px]">
        {translations && (
          <>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleGenerate();
              }}
              className="flex flex-col items-center"
            >
              <div className="text-center mt-40 bg-pinegren/90 shadow-[0_0_5px_3px_rgba(42,54,42,0.9)] rounded-lg p-2 w-[300px]">
                <h1 className="text-2xl font-bold">{translations.title}</h1>
                <p className="mt-2">{translations.inputLabel}</p>
                <input
                  value={prompt}
                  onChange={handleInputChange}
                  placeholder={translations.inputPlaceholder}
                  className="mt-1 border rounded p-2 w-full max-w-md"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`mt-4 z-50 px-4 py-2 bg-darkpinegren rounded hover:bg-darkpinegren/95 disabled:bg-gray-400 ${
                  loading ? "cursor-not-allowed" : ""
                }`}
              >
                {loading
                  ? translations.generateButtonGenerating
                  : translations.generateButton}
              </button>
            </form>

            <p
              className={`relative z-10 mt-[75px] p-2 rounded max-w-64 w-fit bg-pinegren shadow-[0_0_5px_3px_rgba(42,54,42,0.9)] py-2 transition-opacity duration-1000 select-text whitespace-pre-line`}
            >
              {response}
            </p>

            <div className="flex w-full max-w-screen-lg">
              <Image
                src="/grangren.webp"
                alt="A pine branch facing right, covering a field in the middle of the page."
                className={`absolute z-20 top-[300px] left-8 pointer-events-none transition-opacity duration-2000 ${
                  revealed && response ? "opacity-0" : "opacity-100"
                }`}
                width={270}
                height={270}
                layout="intrinsic"
              />
              <Image
                src="/grangren.webp"
                alt="A pine branch facing left, covering a field in the middle of the page."
                className={`absolute z-20 top-[300px] right-8 pointer-events-none transition-opacity duration-1000 scale-x-[-1] ${
                  revealed && response ? "opacity-0" : "opacity-100"
                }`}
                width={270}
                height={270}
                layout="intrinsic"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
