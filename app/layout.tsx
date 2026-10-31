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
  metadataBase: new URL("https://eleccionesceis.vercel.app"),
  title: {
    template: "%s | Comité Electoral EPIS",
    default: "Elecciones CEIS 2027 | Comité Electoral EPIS",
  },
  description:
    "Portal oficial del Comité Electoral EPIS: lista apta, cronograma y comunicados de las Elecciones CEIS 2027.",
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "Elecciones CEIS 2027",
    description:
      "Portal oficial del Comité Electoral EPIS: lista apta, cronograma y comunicados de las Elecciones CEIS 2027.",
    images: [
      {
        url: "/og-elecciones-ceis-2027-compartir.png",
        width: 2400,
        height: 800,
        alt: "Elecciones CEIS 2027",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Elecciones CEIS 2027",
    description:
      "Portal oficial del Comité Electoral EPIS: lista apta, cronograma y comunicados de las Elecciones CEIS 2027.",
    images: ["/og-elecciones-ceis-2027-compartir.png"],
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
      suppressHydrationWarning
      className={cn(
        "h-full antialiased",
        geistSans.variable,
        geistMono.variable,
        notoSans.variable,
        playfairDisplayHeading.variable
      )}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
              const root = document.documentElement;
              let timer;
              function updateTheme() {
                const now = new Date();
                const hour = now.getHours();
                const dark = hour >= 18 || hour < 6;
                root.classList.toggle('dark', dark);
                root.style.colorScheme = dark ? 'dark' : 'light';
                const next = new Date(now);
                if (hour < 6) next.setHours(6, 0, 0, 0);
                else if (hour < 18) next.setHours(18, 0, 0, 0);
                else {
                  next.setDate(next.getDate() + 1);
                  next.setHours(6, 0, 0, 0);
                }
                clearTimeout(timer);
                timer = setTimeout(updateTheme, Math.max(1000, next.getTime() - now.getTime()));
              }
              updateTheme();
              document.addEventListener('visibilitychange', () => {
                if (!document.hidden) updateTheme();
              });
            })();`,
          }}
        />
      </head>
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
