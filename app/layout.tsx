import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Beringei Shield — A closer look at every coffee leaf",
  description:
    "A thoughtful AI screening tool for coffee leaf health. Upload a field photo to explore the Beringei Shield proof of concept.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
