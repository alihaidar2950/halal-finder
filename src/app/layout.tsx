import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Roboto, Montserrat } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700", "900"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "Halal Finder | Premium Halal Restaurant Directory",
  description: "Discover premium halal restaurants with confidence and elegance",
  keywords: ["halal", "restaurant", "food", "dining", "cuisine", "muslim-friendly"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${roboto.variable} antialiased bg-black text-white`}
      >
        <AuthProvider>
          {children}
          <Analytics />
          <Toaster 
            position="top-center" 
            theme="dark"
            toastOptions={{
              style: {
                background: '#1c1c1c',
                border: '1px solid #333',
                color: '#fff',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
