import type { Metadata } from "next";
import { Outfit } from "next/font/google"; // Updated font
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { AppProvider } from "@/context/AppContext";
import GlobalShortcuts from "@/components/GlobalShortcuts"; // Import SmoothScroll

const outfit = Outfit({ subsets: ["latin"] }); // Configure Outfit

export const metadata: Metadata = {
  title: "IS4GI.dev",
  description: "The hardware behind IS4GI.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} antialiased`}>
        <AppProvider>
          <GlobalShortcuts />
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </AppProvider>
      </body>
    </html>
  );
}
