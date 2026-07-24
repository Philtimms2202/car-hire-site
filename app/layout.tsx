import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { LocaleProvider } from '@/context/localeContext';
import AdBanner from '@/app/components/AdBanner';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://timmstravel.com'),
  title: "Timms Travel | Compare Flights, Hotels, Experiences & More!",
  description:
    "Choose from thousands of destinations, compare hotel prices, and find flights with Timms Travel.",
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
        {/* ✅ Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6886846670145470"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

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

        {/* ✅ Mailchimp Connected Site Script */}
        <Script
          id="mcjs"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(c,h,i,m,p){m=c.createElement(h),p=c.getElementsByTagName(s)[0],m.async=1,m.src=i,p.parentNode.insertBefore(m,p)}(document,"script","https://chimpstatic.com/mcjs-connected/js/users/016d711d87ab0fa13c114b3fd/8bb82035ac754c4f8491f2d83.js");
            `,
          }}
        />

        {/* ✅ GetYourGuide */}
        <Script
          src="https://widget.getyourguide.com/dist/pa.umd.production.min.js"
          data-gyg-partner-id="P7B7GRH"
          strategy="afterInteractive"
        />

        <Script
          src="https://widget.getyourguide.com/dist/gyg-widget.js"
          strategy="afterInteractive"
        />

        {/* ✅ TravelPayouts White Label Web — TEMPORARILY DISABLED FOR CSS CONFLICT TEST */}
        {/* <Script
          id="tpwl-loader"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                var script = document.createElement("script");
                script.async = 1;
                script.type = "module";
                script.src = "https://tpemb.com/wl_web/main.js?wl_id=19994";
                document.head.appendChild(script);
              })();
            `,
          }}
        /> */}
      </head>

      <body className="min-h-full flex flex-col">
        <LocaleProvider>
          {children}
        </LocaleProvider>

        {/* Sticky footer ad banner - sitewide, least intrusive placement */}
        <AdBanner />
      </body>
    </html>
  );
}