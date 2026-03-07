import type { Metadata } from "next";
import { Lora, Manrope } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import "./globals.css";

const headingFont = Lora({
  variable: "--font-heading",
  subsets: ["latin"],
});

const bodyFont = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SSU Student Result Portal",
  description: "Student Result Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${headingFont.variable} ${bodyFont.variable} antialiased`}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
