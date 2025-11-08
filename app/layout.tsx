import type { Metadata } from "next";
import { ThemeProvider } from "@/src/components/ThemeProvider";
import { AuthProvider } from "@/src/components/AuthProvider";
import { LayoutWrapper } from "@/src/components/LayoutWrapper";
import "@/src/styles/globals.css";

export const metadata: Metadata = {
  title: "Guildustry - Building the Future of Skilled Trades",
  description:
    "Connect skilled trades candidates with employers. Find high-paying jobs that offer stability—without the burden of college debt.",
  icons: {
    icon: "/favicon.ico",
  },
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
          <AuthProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
