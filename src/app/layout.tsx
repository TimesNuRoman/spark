import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Spark - Лучшая социальная сеть нового поколения",
  description: "Spark - превзошел все существующие сети. Интеллектуальный фид, E2E шифрование, аналитика лучше Google Meta. Скачайте мобильное приложение!",
  keywords: "социальная сеть, Spark, социальные сети, privacy, шифрование, аналитика, AI читатель дум",
  authors: [{ name: "Spark Team" }],
  creator: "Spark Platform",
  publisher: "Spark",
  robots: "index, follow",
  openGraph: {
    title: "Spark - Лучшая социальная сеть",
    description: "Платформа, превосходящая все существующие соцсети",
    url: "https://spark-social.com",
    siteName: "Spark",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Spark - Лучшая социальная сеть",
    description: "Платформа, превосходящая все существующие соцсети",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={inter.variable}>
      <body
        className={`${inter.variable} ${jetBrainsMono.variable} antialiased bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100`}
      >


        {/* Mobile Navigation */}
        <div className="lg:hidden">
          <header className="bg-white dark:bg-gray-800 shadow-sm">
            <nav className="px-4 sm:px-6">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold text-red-600">SPARK</h1>
                </div>
                <div className="flex items-center">
                  <a href="/login" className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm">
                    Скачать
                  </a>
                </div>
              </div>
            </nav>
          </header>
        </div>

        <ClientLayout>
          <main className="min-h-screen">
            {children}
          </main>
        </ClientLayout>

        <footer className="bg-gray-50 border-t border-gray-200 py-8">
          <div className="max-w-md mx-auto px-6 text-center">
            <div className="text-sm text-gray-600 mb-4">
              © 2025 Spark. Лучшая социальная сеть нового поколения.
            </div>
            <div className="text-xs text-gray-500 space-x-4">
              <a href="#" className="hover:text-gray-700">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-gray-700">Terms of Service</a>
              <span>•</span>
              <a href="#" className="hover:text-gray-700">Cookie Policy</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
