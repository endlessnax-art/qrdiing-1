import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QRDening - Multi-Restaurant SaaS Platform | Scan. Order. Manage. Grow.",
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
  ],
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
