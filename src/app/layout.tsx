import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Primeform Labs — VMC Operator HMI",
  description: "Human Machine Interface for VMC Machine Operator Startup & Operation Workflow",
  keywords: ["VMC", "HMI", "CNC", "Machining", "Primeform Labs", "Industrial Automation"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-hmi-bg text-hmi-text bg-tactical-grid min-h-screen">
        {children}
      </body>
    </html>
  );
}
