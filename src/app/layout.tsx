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
          rel="prefetch"
          as="image"
          href="/bg_gran.webp"
          media="(max-width: 1023px)"
          fetchPriority="high"
        />
        <link
          rel="prefetch"
          as="image"
          href="/bg_gran_large.webp"
          media="(min-width: 1920px)"
        />
        <link rel="prefetch" href="/grangren.webp" fetchPriority="high" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
