import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Trading Journal",
  description: "Ein Journal für Trading-Aktivitäten",
};

export default function RootLayout({ children }) {
  return (
    <html lang="de" className={inter.className}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
