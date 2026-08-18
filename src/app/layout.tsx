import type { Metadata } from "next";
import { Inter, Julius_Sans_One } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import LoadingGate from "@/components/LoadingGate";
import ScrollbarActivity from "@/components/ScrollbarActivity";
import SmoothScroll from "@/components/SmoothScroll";
import BackToTop from "@/components/BackToTop";
import "./globals.css";

const juliusSansOne = Julius_Sans_One({
  variable: "--font-julius-sans-one",
  weight: "400",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Holly Johanna - Art Portfolio",
  description:
    "Paintings and works by Holly Johanna. A collection of original art, exhibitions, and commissions.",
  metadataBase: new URL("https://art.hollyjohanna.com"),
  openGraph: {
    title: "Holly Johanna - Art Portfolio",
    description:
      "Paintings and works by Holly Johanna. A collection of original art, exhibitions, and commissions.",
    type: "website",
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
      className={`${juliusSansOne.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">
        <SmoothScroll />
        <LoadingGate>
          <Nav />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
          <ScrollbarActivity />
        </LoadingGate>
        <BackToTop />
      </body>
    </html>
  );
}
