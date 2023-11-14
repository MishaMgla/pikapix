import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import logo from "../public/logo.svg";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pikapix",
  description: "Image your own art",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-8HVRZ4N33Z" />
        <Script id="googleAnalytics">
          {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-8HVRZ4N33Z');`}
        </Script>
      </head>
      <body className={inter.className}>
        <Image
          priority
          src={logo}
          alt="Follow us on Twitter"
          style={{
            position: "absolute",
            top: "25px",
            left: "25px",
            zIndex: 100,
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
