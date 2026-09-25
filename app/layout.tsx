import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/web/navbar";
import { Footer } from "@/components/web/footer";

const playfairDisplayHeading = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ce-epis-system-web.vercel.app"),
  title: {
    template: "%s | Comité Electoral EPIS",
    default: "Elecciones CEIS 2027 | Comité Electoral EPIS",
  },
  description:
    "Portal oficial del Comité Electoral EPIS: Cronograma, inscripción de listas, comunicados oficiales y kit electoral.",
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "Elecciones CEIS 2027",
    description:
      "Portal oficial del Comité Electoral EPIS: cronograma, inscripción de listas, comunicados oficiales y kit electoral.",
    images: [
      {
        url: "/og-elecciones-ceis-2027.png",
        width: 1200,
        height: 630,
        alt: "Elecciones CEIS 2027",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Elecciones CEIS 2027",
    description:
      "Portal oficial del Comité Electoral EPIS: cronograma, inscripción de listas, comunicados oficiales y kit electoral.",
    images: ["/og-elecciones-ceis-2027.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={cn(
        "h-full antialiased",
        geistSans.variable,
        geistMono.variable,
        notoSans.variable,
        playfairDisplayHeading.variable
      )}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground selection:bg-primary/20 selection:text-primary">

        <Navbar />

        <main className="flex-1">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
