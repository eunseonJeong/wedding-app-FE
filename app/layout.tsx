import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

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
