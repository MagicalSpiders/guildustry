import type { Metadata } from "next";
import { ThemeProvider } from "@/src/components/ThemeProvider";
import "@/src/styles/globals.css";
import { Header } from "@/src/components/Header";
import { Footer } from "@/src/components/Footer";

export const metadata: Metadata = {
  title: "Guildustry - Building the Future of Skilled Trades",
  description:
    "Connect skilled trades candidates with employers. Find high-paying jobs that offer stability—without the burden of college debt.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-display antialiased">
        <ThemeProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
