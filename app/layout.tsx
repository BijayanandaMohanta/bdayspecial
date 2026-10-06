import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "./navigation";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WishCraft - Interactive 3D Celebration Cards",
  description:
    "Send personalized, interactive 3D surprise links for birthdays and milestones.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-[#050508]">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-full bg-[#050508] text-white antialiased font-sans`}
      >
        <Navigation/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
