'use client'

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { LocaleProvider } from '@/context/localeContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Timms Travel | Compare Flights, Hotels, Experiences & More!",
  description:
    "Choose from thousands of destinations, compare hotel prices, and reserve your hire car before your trip begins.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* ✅ Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-K4RWSHXR');
            `,
          }}
        />

        {/* ✅ GetYourGuide Analytics */}
        <Script
          src="https://widget.getyourguide.com/dist/pa.umd.production.min.js"
          data-gyg-partner-id="P7B7GRH"
          strategy="afterInteractive"
        />

        {/* ✅ GetYourGuide Widget */}
        <Script
          src="https://widget.getyourguide.com/dist/gyg-widget.js"
          strategy="afterInteractive"
        />
      </head>

      <body className="min-h-full flex flex-col">
        {/* ✅ App wrapper */}
        <LocaleProvider>
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}