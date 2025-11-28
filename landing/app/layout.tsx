import type { Metadata } from "next";
import "./globals.css";

const baseUrl = "https://www.khatricollege.com";

export const metadata: Metadata = {
  title: "Khatri College | Landing Page",
  description:
    "Official landing page for Khatri College. Explore courses, admissions, events, and more.",
  metadataBase: new URL(baseUrl),

  // --- FAVICONS ---
  icons: {
    icon: [
      { url: "/favicon_io/favicon-16x16.png", sizes: "16x16" },
      { url: "/favicon_io/favicon-32x32.png", sizes: "32x32" },
      { url: "/favicon_io/android-chrome-192x192.png", sizes: "192x192" },
      { url: "/favicon_io/android-chrome-512x512.png", sizes: "512x512" },
    ],
    apple: "/favicon_io/apple-touch-icon.png",
    shortcut: "/favicon_io/favicon.ico",
  },

  manifest: "/favicon_io/site.webmanifest",

  // --- SEO BEST PRACTICES ---
  alternates: {
    canonical: baseUrl + "/",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },

  // --- OPEN GRAPH ---
  openGraph: {
    title: "Khatri College | Transforming Education",
    description:
      "Explore programs, campus life, and admission details at Khatri College.",
    url: baseUrl,
    siteName: "Khatri College",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png", // Add your OG image (1200×630 recommended)
        width: 1200,
        height: 630,
        alt: "Khatri College Landing Page",
      },
    ],
  },

  // --- TWITTER CARD ---
  twitter: {
    card: "summary_large_image",
    title: "Khatri College",
    description:
      "Official landing page for Khatri College. Learn more about academics and admissions.",
    images: ["/og-image.png"],
    creator: "@KhatriCollege",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
