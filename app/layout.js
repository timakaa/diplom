import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "./context/AuthProvider";
import QueryProvider from "@/components/providers/QueryProvider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "АвтоАукцион",
  description: "Платформа для проведения автомобильных аукционов",
};

export default function RootLayout({ children }) {
  return (
    <html lang='ru'>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} dark antialiased`}
      >
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
