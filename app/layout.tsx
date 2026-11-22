import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://qrdine.vercel.app";

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "QRDine - Multi-Restaurant QR Digital Menu SaaS Platform",
    template: "%s | QRDine",
  },
  description:
    "Empower your restaurant with smart, scannable digital QR menus. Multi-tenant SaaS platform with custom restaurant dashboards, high-res table QR codes, and AI menu conversion ready.",
  keywords: [
    "QRDine",
    "QR Menu",
    "Digital Menu SaaS",
    "Restaurant QR Code",
    "Multi-restaurant Platform",
    "Contactless Menu",
    "Restaurant Tech",
    "AI Menu Digitizer",
  ],
  authors: [{ name: "QRDine Technologies" }],
  creator: "QRDine",
  publisher: "QRDine SaaS",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "QRDine - Multi-Restaurant QR Digital Menu SaaS",
    description:
      "Modern multi-restaurant digital QR menu platform. One platform, independent restaurant portals, custom QR codes, and zero app downloads for diners.",
    siteName: "QRDine",
  },
  twitter: {
    card: "summary_large_image",
    title: "QRDine - Multi-Restaurant QR Digital Menu SaaS",
    description:
      "Modern multi-restaurant digital QR menu platform. Contactless menus, custom QR codes, and real-time menu management.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col bg-white text-slate-900 antialiased selection:bg-brand-100 selection:text-brand-900">
        {children}
      </body>
    </html>
  );
}
