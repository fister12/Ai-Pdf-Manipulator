import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/lib/theme";
import { GlobalProviders } from "@/lib/context/GlobalProviders";
import { AppShell } from "@/components/AppShell";
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
  title: "Teaching Assistant Hub",
  description: "AI-powered learning platform with notes processing, flashcards, and interactive study mode",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-slate-950 text-black dark:text-white transition-colors duration-300`}
      >
        <ThemeProvider>
          <GlobalProviders>
            <AppShell>
              {children}
            </AppShell>
          </GlobalProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
