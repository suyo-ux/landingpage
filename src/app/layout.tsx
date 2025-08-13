import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://runcrew.example.com"),
  title: {
    default: "RunCrew — 러닝크루 모집 랜딩페이지",
    template: "%s | RunCrew",
  },
  description: "러닝크루와 함께 건강한 라이프스타일을 시작하세요.",
  openGraph: {
    title: "RunCrew — 러닝크루 모집",
    description: "함께 달리면 더 멀리 갈 수 있어요. 지금 RunCrew에서 러닝 메이트를 만나보세요.",
    type: "website",
    locale: "ko_KR",
    url: "https://runcrew.example.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "RunCrew — 러닝크루 모집",
    description: "함께 달리면 더 멀리. 지금 RunCrew에서 시작하세요.",
  },
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
    <html lang="ko" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){try{var t=localStorage.getItem('theme');var d=t? t==='dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;var c=document.documentElement.classList;c[d?'add':'remove']('dark');}catch(e){}})();`}
        </Script>
      </head>
      <body className={`${inter.variable} ${poppins.variable} antialiased bg-background text-foreground min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
