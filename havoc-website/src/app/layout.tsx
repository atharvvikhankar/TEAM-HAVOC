import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import NotificationManager from "@/components/NotificationManager";
import { AuthProvider } from "@/context/AuthContext";
import { UIProvider } from "@/context/UIContext";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "HAVOC — Build. Break. Rebuild.",
  description:
    "HAVOC is a student hackathon team building ambitious products, experimenting with emerging technology, and solving real-world problems.",
  openGraph: {
    title: "HAVOC — Build. Break. Rebuild.",
    description:
      "HAVOC is a student hackathon team building ambitious products, experimenting with emerging technology, and solving real-world problems.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.variable} antialiased bg-background text-foreground`}>
        <AuthProvider>
          <UIProvider>
            <SmoothScroll />
            <NotificationManager />
            {children}
            <Toaster position="bottom-right" toastOptions={{ className: 'font-inter font-medium rounded-2xl shadow-xl border-black/5' }} />
          </UIProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
