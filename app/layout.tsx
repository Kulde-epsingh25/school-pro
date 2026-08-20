import type { Metadata } from "next";
import "./globals.css";
import { validateEnv } from "@/lib/env";

export const runtime = "edge";

validateEnv();

export const metadata: Metadata = {
  title: {
    default: "School Pro — Unified Multi-Tenant School Management OS",
    template: "%s | School Pro"
  },
  description: "Enterprise operating system for modern schools: admissions, IoT attendance, fee accounting, LMS, and portal hubs for students, guardians, and educators.",
  keywords: [
    "school management software",
    "school ERP",
    "student information system",
    "tuition ledger",
    "biometric attendance",
    "school bus tracking"
  ],
  authors: [{ name: "School Pro Engineering Team" }],
  openGraph: {
    title: "School Pro — Unified Multi-Tenant School Management OS",
    description: "Enterprise operating system for modern schools: admissions, IoT attendance, fee accounting, and real-time portals.",
    url: "https://schoolpro.com",
    siteName: "School Pro",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "School Pro — Unified Multi-Tenant School Management OS",
    description: "Enterprise operating system for modern schools: admissions, IoT attendance, and real-time portals."
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="font-sans h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
        {children}
      </body>
    </html>
  );
}
