import { Inter } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Resumix — Build better resumes",
    template: "%s | Resumix",
  },
  description:
    "Build a professional resume with original templates, then check it for ATS compatibility and actionable improvements.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col font-sans"
      >
        {children}
      </body>
    </html>
  );
}
