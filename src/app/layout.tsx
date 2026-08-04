import "@/styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Resuvee — Build better resumes",
    template: "%s | Resuvee",
  },
  description:
    "Build a professional resume with original templates, then check it for ATS compatibility and actionable improvements.",
};

import { AuthProvider, AuthModal } from "@/modules/auth";
import { NotificationProvider } from "@/shared/components/ui/notification-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col font-sans">
        <AuthProvider>
          {children}
          <AuthModal />
          <NotificationProvider />
        </AuthProvider>
      </body>
    </html>
  );
}
