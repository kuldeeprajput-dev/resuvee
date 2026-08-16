import "@/styles/globals.css";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { AuthProvider, AuthModal } from "@/modules/auth";
import { NotificationProvider } from "@/shared/components/ui/notification-provider";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const fontModern = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-modern",
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://resuvee.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Resuvee — Professional Resume Builder & ATS Analyzer",
    template: "%s | Resuvee",
  },
  description:
    "Build ATS-friendly professional resumes with 16 original templates, perform AI writing checks, analyze ATS keyword scores, and export vector PDF & Word DOCX files.",
  keywords: [
    "resume builder",
    "free resume builder",
    "ATS resume checker",
    "ATS resume analyzer",
    "cover letter generator",
    "professional resume templates",
    "fresher resume format",
    "DOCX resume export",
    "PDF resume export",
    "Resuvee",
  ],
  authors: [{ name: "Resuvee Team" }],
  creator: "Resuvee",
  publisher: "Resuvee",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "Resuvee — Professional Resume Builder & ATS Analyzer",
    description:
      "Build ATS-friendly professional resumes with 16 original templates, perform AI writing checks, analyze ATS keyword scores, and export clean PDF & Word files.",
    siteName: "Resuvee",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Resuvee — Professional Resume Builder & ATS Analyzer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Resuvee — Professional Resume Builder & ATS Analyzer",
    description:
      "Build ATS-friendly professional resumes with 16 original templates, perform AI writing checks, analyze ATS keyword scores, and export clean PDF & Word files.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/resuvee-mark.webp",
    apple: "/resuvee-mark.webp",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Resuvee",
  operatingSystem: "All",
  applicationCategory: "BusinessApplication",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Build ATS-friendly professional resumes with 16 original templates, perform AI writing checks, analyze ATS keyword scores, and export clean PDF & Word files.",
  url: siteUrl,
};

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
      className={`h-full antialiased ${fontSans.variable} ${fontModern.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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
