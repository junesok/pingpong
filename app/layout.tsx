import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "pingpong",
  description: "pingpong",
  openGraph: {
    title: "pingpong",
    description: "pingpong",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${playfair.variable} ${inter.variable}`}>
      <body style={{ width: "100%", height: "100vh", overflow: "hidden" }}>
        {children}
      </body>
    </html>
  );
}
