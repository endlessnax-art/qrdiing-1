import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://qrdineing.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "QRDening - Multi-Restaurant SaaS Platform | Scan. Order. Manage. Grow.",
    template: "%s | QRDening",
  },
  description:
    "All-in-one smart restaurant technology ecosystem: Digital QR Menus, Table-wise Ordering, Kitchen Display System (KDS), Waiter Dashboard, Real-time Sales Analytics, Loyalty & Subscriptions.",
  keywords: [
    "QRDening",
    "QR Menu",
    "Restaurant POS",
    "Table Ordering",
    "Kitchen Display System",
    "Restaurant SaaS India",
    "Cloud Kitchen Software",
    "GST Invoicing",
  ],
  authors: [{ name: "QRDening SaaS Platform" }],
  creator: "QRDening Technologies",
  publisher: "QRDening Technologies",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    title: "QRDening - Multi-Restaurant SaaS Platform | Scan. Order. Manage. Grow.",
    description:
      "All-in-one smart restaurant technology ecosystem: Digital QR Menus, Table Ordering, Kitchen KDS, Waiter Dashboard, Real-time Sales Analytics, Loyalty & Subscriptions.",
    siteName: "QRDening",
    images: [
      {
        url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80",
        width: 1200,
        height: 630,
        alt: "QRDening Restaurant Management Ecosystem",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "QRDening - Multi-Restaurant SaaS Platform",
    description:
      "Digital QR Menus, Table Ordering, Kitchen KDS, Waiter Calling, Real-time Sales Analytics.",
    images: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80",
    ],
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
