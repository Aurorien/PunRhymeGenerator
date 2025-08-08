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
      {/* <head>
        <link
          rel="preload"
          as="image"
          href="/bg_gran_small.webp"
          media="(max-width: 1023px)"
        />
        <link
          rel="preload"
          as="image"
          href="/bg_gran_medium.webp"
          media="(min-width: 1024px) and (max-width: 1919px)"
        />
        <link
          rel="prefetch"
          as="image"
          href="/bg_gran.webp"
          media="(min-width: 1920px)"
        />
      </head> */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
