import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import QueryProvider from "@/components/providers/QueryProvider"; // Import the new QueryProvider

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NAVA Analytics Dashboard",
  description: "A powerful and visually appealing interface for tracking key content creation metrics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log("RootLayout is rendering!"); // Added for debugging
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <QueryProvider> {/* Use the new QueryProvider here */}
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AuthProvider>
              {children}
            </AuthProvider>
          </TooltipProvider>
        </QueryProvider>
      </body>
    </html>
  );
}