import { Bebas_Neue, Work_Sans, Space_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const display = Bebas_Neue({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

const body = Work_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const score = Space_Mono({
  variable: "--font-score",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata = {
  title: "ASC Yaakar — Mboro, Thiès",
  description:
    "Site officiel de l'ASC Yaakar : calendrier, résultats des Navétanes, effectif et actu du quartier de Mboro.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body
        className={`${display.variable} ${body.variable} ${score.variable} antialiased`}
      >
        <Header />
        <main className="min-h-[70vh]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
