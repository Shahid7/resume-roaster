import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'SHAHID_LABS // SESSION_01',
  description: '30 Days of AI Experiments. Build & Destroy.',
  openGraph: {
    title: 'SHAHID_LABS // SESSION_01',
    description: '30 Days of AI Experiments. Build & Destroy.',
    url: 'https://shahid-labs.vercel.app', // Replace with your actual URL
    siteName: 'SHAHID_LABS',
    images: [
      {
        url: '/opengraph-image.png', // This points to the image in your public folder
        width: 1200,
        height: 630,
        alt: 'SHAHID_LABS Session 01 Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SHAHID_LABS // SESSION_01',
    description: '30 Days of AI Experiments. Build & Destroy.',
    images: ['/opengraph-image.png'], 
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        {/* This stays invisible until a toast is triggered */}
        <Toaster position="top-center" richColors /> 
      </body>
    </html>
  );
}