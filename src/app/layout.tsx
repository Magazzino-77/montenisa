import type { Metadata } from "next";
import {
  Fraunces,
  IBM_Plex_Mono,
  Manrope,
  Playfair_Display,
} from "next/font/google";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const menu = Playfair_Display({
  variable: "--font-menu",
  subsets: ["latin"],
  weight: ["600", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tenuta Montenisa | Franciacorta",
  description:
    "A one-page Tenuta Montenisa homepage foundation inspired by the Figma prototype and ready for Shutter-managed content.",
  metadataBase: new URL("https://montenisa.vercel.app"),
  openGraph: {
    title: "Tenuta Montenisa | Franciacorta",
    description:
      "A refined, chapter-led homepage foundation for Tenuta Montenisa, ready for Shutter-managed content.",
    images: ["/images/montenisa-estate-hero.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} ${menu.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
