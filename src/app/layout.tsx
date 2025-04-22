import type { Metadata } from "next";
import { Poppins, Lato, Overlock_SC } from "next/font/google";
import "./globals.css";
import Layout from "@/components/layout/Layout";
import { Providers } from "./providers";

const primaryFont = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-primary',
});

const secondaryFont = Lato({
  weight: ['100', '300', '400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-secondary',
});

const tertiaryFont = Overlock_SC({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-tertiary',
});

export const metadata: Metadata = {
  title: "PGA2K25 Match Tracker",
  description: "Track and analyze alternate shot 2v2 matches in PGA2K25",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${primaryFont.variable} ${secondaryFont.variable} ${tertiaryFont.variable} font-secondary antialiased`}
      >
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
