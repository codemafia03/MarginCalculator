import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "2026 해외구매대행 마진 계산기 (관부가세/CBM/수수료 완벽 분석)",
  description: "타오바오, 알리익스프레스 직구 및 구매대행 셀러 필수 도구. 실시간 환율, 관부가세(150불 기준), 스마트스토어/쿠팡 수수료를 한 번에 계산하여 순수익을 확인하세요.",
  keywords: "해외구매대행, 마진계산기, 관부가세 계산기, 타오바오 직구, 스마트스토어 수수료, 알리익스프레스, CBM 계산",
  verification: {
    google: "BTBEVlvmBMtxwZxMKtDQPe8HVhtAHeFLEgDCC8XkAgM",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <main className="flex-grow">
          {children}
        </main>

        <footer className="w-full py-8 bg-zinc-100 border-t border-zinc-200 mt-auto">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <p className="text-sm text-gray-500 mb-2">
              © 2026 Seller Note. 본 계산 결과는 참고용이며, 정확한 세액은 관세청 기준을 따릅니다.
            </p>
            <div className="flex justify-center gap-6 text-xs text-gray-400">
              <a href="/terms" className="hover:text-gray-600 transition-colors">이용약관</a>
              <a href="/privacy" className="hover:text-gray-600 transition-colors">개인정보처리방침</a>
              <a href="mailto:contact@sellernote.com" className="hover:text-gray-600 transition-colors">문의하기</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
