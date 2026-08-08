import type { Metadata } from "next";
import { Archivo, Inter } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import LoadingGate from "@/components/LoadingGate";
import ScrollbarActivity from "@/components/ScrollbarActivity";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  weight: ["500", "600"],
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
      className={`${archivo.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">
        <LoadingGate>
          <Nav />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
          <ScrollbarActivity />
        </LoadingGate>
      </body>
    </html>
  );
}
