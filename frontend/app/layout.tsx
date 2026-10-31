import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../hooks/useTheme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DEEPAQ — Environmental Intelligence Platform",
  description:
    "Understand the air. Anticipate the risk. Make better decisions. Multi-basin environmental telemetry, boundary layer meteorological physics, and 1-hour Random Forest predictions across India.",
  icons: {
    icon: [
      { url: "/deepaq-icon.png", sizes: "32x32" },
      { url: "/deepaq-logo.png", sizes: "192x192" },
    ],
    apple: "/deepaq-icon.png",
  },
  openGraph: {
    title: "DEEPAQ — Environmental Intelligence Platform",
    description: "Understand the air. Anticipate the risk. Make better decisions.",
    siteName: "DEEPAQ",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-200">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
