import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        pinegren: "rgb(42, 54, 42)",
        darkpinegren: "rgb(34, 36, 33)",
        lightpinegren: "rgb(131, 174, 131)",
      },
    },
  },
  plugins: [],
} satisfies Config;
