import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

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
        {/* Desktop Navigation */}
        <div className="hidden lg:block">
          <header className="bg-white dark:bg-gray-800 shadow-sm">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <h1 className="text-3xl font-bold text-red-600">SPARK</h1>
                  </div>
                </div>
                <div className="flex items-center space-x-8">
                  <a href="/" className="text-gray-700 dark:text-gray-300 hover:text-red-600 font-medium">Главная</a>
                  <a href="#features" className="text-gray-700 dark:text-gray-300 hover:text-red-600 font-medium">Возможности</a>
                  <a href="#analytics" className="text-gray-700 dark:text-gray-300 hover:text-red-600 font-medium">Аналитика</a>
                  <a href="/feed" className="text-gray-700 dark:text-gray-300 hover:text-red-600 font-medium">Демо Фид</a>
                  <a href="/profile" className="text-gray-700 dark:text-gray-300 hover:text-red-600 font-medium">Демо Профиль</a>
                  <a href="/messages" className="text-gray-700 dark:text-gray-300 hover:text-red-600 font-medium">Сообщения</a>
                  <a href="/login" className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium">
                    Скачать приложение
                  </a>
                </div>
              </div>
            </nav>
          </header>
        </div>

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

        <main className="min-h-screen">
          {children}
        </main>

        <footer className="bg-gray-800 dark:bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-red-400 mb-4">Spark</h2>
              <p className="mb-8 text-gray-300 max-w-2xl mx-auto">
                Лучшая социальная сеть нового поколения. Мы превзошли все существующие платформы с помощью инновационных технологий и глубокого понимания пользовательских нужд.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div>
                  <h3 className="font-semibold mb-4">Продукт</h3>
                  <ul className="space-y-2 text-gray-400">
                    <li><a href="/feed" className="hover:text-white">Демо Фид</a></li>
                    <li><a href="/messages" className="hover:text-white">Сообщения</a></li>
                    <li><a href="#features" className="hover:text-white">Возможности</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">Компьютер</h3>
                  <ul className="space-y-2 text-gray-400">
                    <li><a href="/search" className="hover:text-white">Поиск</a></li>
                    <li><a href="/create" className="hover:text-white">Создать пост</a></li>
                    <li><a href="/profile" className="hover:text-white">Профиль</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">Ресурсы</h3>
                  <ul className="space-y-2 text-gray-400">
                    <li><a href="#analytics" className="hover:text-white">Аналитика</a></li>
                    <li><a href="/notifications" className="hover:text-white">Уведомления</a></li>
                    <li><a href="#" className="hover:text-white">Центр поддержки</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">Компания</h3>
                  <ul className="space-y-2 text-gray-400">
                    <li><a href="#" className="hover:text-white">О нас</a></li>
                    <li><a href="#" className="hover:text-white">Карьера</a></li>
                    <li><a href="#" className="hover:text-white">Контакты</a></li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-gray-700 pt-8">
                <div className="flex flex-col sm:flex-row justify-between items-center">
                  <p className="text-gray-400">© 2025 Spark. Все права защищены.</p>
                  <div className="flex space-x-6 mt-4 sm:mt-0">
                    <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
                    <a href="#" className="text-gray-400 hover:text-white">Terms of Service</a>
                    <a href="#" className="text-gray-400 hover:text-white">Cookie Policy</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
