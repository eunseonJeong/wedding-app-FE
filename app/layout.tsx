import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/app/Providers";
import { useTheme } from "next-themes";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wedding",
  description: "Wedding App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen transition duration-300 ">
        {/*<Providers>*/}
        <main className="bg-white dark:black">{children}</main>
        <Toaster />
        {/*</Providers>*/}
      </body>
    </html>
  );
}
