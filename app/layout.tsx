import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "XPES AI Sales Engine",
  description: "Independent AI-powered customer development workspace for XPES."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}