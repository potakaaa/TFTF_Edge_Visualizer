import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TFTF Edge Visualizer",
  description:
    "A visualizer for the TFTF Edge novel data structure — a flexible public transport route model",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-primary antialiased`}>{children}</body>
    </html>
  );
}
