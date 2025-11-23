import type { Metadata } from "next";
import "./globals.css";
import { ThemeProviders } from "@/components/ThemeProvider";

const baseUrl = "https://student.khatricollege.com";

export const metadata: Metadata = {
  title: "Khatri College Student Portal",
  description:
    "Secure student portal for Khatri College. Access classes, materials, study resources, exam results, attendance, announcements, and profile information.",
  metadataBase: new URL(baseUrl),

  // FAVICONS
  icons: {
    icon: [
      { url: "/assets/favicon_io/favicon-16x16.png", sizes: "16x16" },
      { url: "/assets/favicon_io/favicon-32x32.png", sizes: "32x32" },
      { url: "/assets/favicon_io/android-chrome-192x192.png", sizes: "192x192" },
      { url: "/assets/favicon_io/android-chrome-512x512.png", sizes: "512x512" },
    ],
    apple: "/assets/favicon_io/apple-touch-icon.png",
    shortcut: "/assets/favicon_io/favicon.ico",
  },

  manifest: "/assets/favicon_io/site.webmanifest",

  // SEO
  alternates: {
    canonical: baseUrl + "/",
  },

  // Prevent search engines from indexing login portals
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },

  // Open Graph
  openGraph: {
    title: "Khatri College Student Portal",
    description:
      "Login to your Khatri College student dashboard. Access classroom resources, announcements, assignments, attendance, and results.",
    url: baseUrl,
    siteName: "Khatri College Student Portal",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Khatri College Student Portal Dashboard",
      },
    ],
  },

  // Twitter
  twitter: {
    card: "summary_large_image",
    title: "Khatri College Student Portal",
    description:
      "Access your academic dashboard, resources, and announcements.",
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
      <body
        className={`antialiased`}
      >
        <ThemeProviders>
          {children}
        </ThemeProviders>
      </body>
    </html>
  );
}
