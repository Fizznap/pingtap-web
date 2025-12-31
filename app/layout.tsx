import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";
import { BottomNav } from "@/components/layout/BottomNav";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PINGTAP Broadband | Ultra-Fast Fiber Internet",
  description: "Experience high-speed fiber broadband in Thane with PINGTAP. Plans starting from ₹399/mo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased bg-background text-text-primary pb-16 md:pb-0`}
      >
        {children}
        <BottomNav />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
