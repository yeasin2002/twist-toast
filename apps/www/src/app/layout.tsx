import { Syne } from "next/font/google";

import type { Metadata } from "next";

import { Footer } from "@/components/blocks/footer";
import { Navbar } from "@/components/blocks/navbar";
import { StyleGlideProvider } from "@/components/styleglide-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { dmSans } from "@/lib/fonts";
import "@/styles/globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${syne.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <StyleGlideProvider />
          <a
            href="#content"
            className="focus:bg-background focus:text-foreground focus:ring-primary sr-only fixed top-3 left-3 z-[70] rounded-md px-3 py-2 text-sm font-medium focus:not-sr-only focus:ring-2 focus:outline-hidden"
          >
            Skip to content
          </a>
          <Navbar />
          <main id="content">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: {
    default: "twist-toast · Design-system-first React toasts",
    template: "%s · twist-toast",
  },
  description:
    "Create React toasts that match your design system. twist-toast handles queueing, timing, accessibility, and typed variant APIs.",
  keywords: [
    "twist-toast",
    "React toast notifications",
    "TypeScript toast library",
    "design system toasts",
    "custom toast components",
    "toast provider",
  ],
  authors: [{ name: "twist-toast contributors" }],
  creator: "twist-toast",
  publisher: "twist-toast",
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "48x48" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [{ url: "/favicon/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: [{ url: "/favicon/favicon.ico" }],
  },
  openGraph: {
    title: "twist-toast · Own every toast pixel",
    description:
      "Build React toast notifications that fit your product UI exactly while twist-toast handles runtime behavior.",
    siteName: "twist-toast",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "twist-toast landing page preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "twist-toast · Design-system-first React toasts",
    description:
      "Type-safe toast behavior with complete control over UI components.",
    images: ["/og-image.jpg"],
    creator: "@twist_toast",
  },
};
