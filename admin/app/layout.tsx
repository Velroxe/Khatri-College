import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const baseUrl = "https://admin.khatricollege.com";

export const metadata: Metadata = {
  title: "Khatri College Admin Panel",
  description:
    "Administrative dashboard for Khatri College. Manage courses, admissions, student data, analytics, website content, and internal operations.",
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
    title: "Khatri College Admin Panel",
    description:
      "Internal admin dashboard for managing Khatri College operations, admissions, analytics, and content.",
    url: baseUrl,
    siteName: "Khatri College Admin",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Khatri College Admin Panel Dashboard",
      },
    ],
  },

  // Twitter
  twitter: {
    card: "summary_large_image",
    title: "Khatri College Admin Panel",
    description:
      "Official admin dashboard for internal management of Khatri College.",
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`antialiased`}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
