import type { Metadata } from "next";
import localFont from "next/font/local";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ClientShell } from "@/components/ClientShell";
import { MobileQuickNav } from "@/components/MobileQuickNav";
import { ExplorationGuide } from "@/components/ExplorationGuide";
import { ScrollDirection } from "@/components/ScrollDirection";
import { ScrollProgress } from "@/components/ScrollProgress";
import { SectionDividers } from "@/components/SectionDividers";
import { ViewTransitionNav } from "@/components/ViewTransitionNav";
import "./globals.css";

const ethnocentric = localFont({
  src: "../../public/fonts/Ethnocentric-Regular.otf",
  variable: "--font-ethnocentric",
});

export const metadata: Metadata = {
  title: "Adrian S. Garcia — Backend-focused Full-Stack Developer",
  description: "Professional developer portfolio for Adrian S. Garcia.",
};

const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${ethnocentric.variable} h-full antialiased scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col relative">
        <div className="grid-bg" aria-hidden="true" />
        <ClientShell>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
          <MobileQuickNav />
          <ExplorationGuide />
          <ScrollDirection />
          <ScrollProgress />
          <SectionDividers />
          <ViewTransitionNav />
        </ClientShell>
      </body>
    </html>
  );
}
