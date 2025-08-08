import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pun rhyme generator",
  description: "AI generated pun rhymes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          as="image"
          href="/bg_gran_small.png"
          media="(max-width: 1023px)"
        />
        <link
          rel="preload"
          as="image"
          href="/bg_gran_medium.png"
          media="(min-width: 1024px) and (max-width: 1919px)"
        />
        <link
          rel="preload"
          as="image"
          href="/bg_gran.png"
          media="(min-width: 1920px)"
        />
        <link rel="preload" as="image" href="/grangren1.png" />
        <link rel="preload" as="image" href="/grangren2.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
