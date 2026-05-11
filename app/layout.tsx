import type { Metadata, Viewport } from "next";
import "@/app/globals.css";
import { PwaRegister } from "@/components/pwa-register";

export const metadata: Metadata = {
  title: "AmritVella",
  description: "Sikh discipline, healing, career, and self-mastery tracker.",
  applicationName: "AmritVella",
  manifest: "/manifest.webmanifest"
};

export const viewport: Viewport = {
  themeColor: "#ff5a1f",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
