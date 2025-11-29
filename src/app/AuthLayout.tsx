'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Removed automatic redirects that interfere with navigation
  // Each protected page will handle authentication locally if needed

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <>
      {/* Auth Navigation for authenticated users */}
      {isAuthenticated && (
        <div className="hidden lg:block">
          <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-12">
                <div className="flex items-center">
                  <a href="/feed" className="text-xl font-bold text-red-600">
                    🌍 SPARK
                  </a>
                </div>
                <div className="flex items-center space-x-6">
                  <a href="/feed" className={`font-medium ${pathname === '/feed' ? 'text-red-600' : 'text-gray-700 dark:text-gray-300 hover:text-red-600'}`}>
                    Фид
                  </a>
                  <a href="/search" className={`font-medium ${pathname === '/search' ? 'text-red-600' : 'text-gray-700 dark:text-gray-300 hover:text-red-600'}`}>
                    Поиск
                  </a>
                  <a href="/messages" className={`font-medium ${pathname === '/messages' ? 'text-red-600' : 'text-gray-700 dark:text-gray-300 hover:text-red-600'}`}>
                    Сообщения
                  </a>
                  <a href="/create" className={`font-medium ${pathname === '/create' ? 'text-red-600' : 'text-gray-700 dark:text-gray-300 hover:text-red-600'}`}>
                    Создать
                  </a>
                  <div className="flex items-center space-x-3">
                    <img
                      src={user?.avatar || 'https://via.placeholder.com/32'}
                      alt={user?.username}
                      className="w-8 h-8 rounded-full"
                    />
                    <a href="/profile" className={`font-medium ${pathname === '/profile' ? 'text-red-600' : 'text-gray-700 dark:text-gray-300 hover:text-red-600'}`}>
                      {user?.username}
                    </a>
                    <button
                      onClick={handleLogout}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm"
                    >
                      Выход
                    </button>
                  </div>
                </div>
              </div>
            </nav>
          </header>
        </div>
      )}

      {/* Public Navigation */}
      {!isAuthenticated && (
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
                  <a href="/feed" className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium">
                    Попробовать
                  </a>
                </div>
              </div>
            </nav>
          </header>
        </div>
      )}

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <nav className="px-4 sm:px-6">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-red-600">
                  {isAuthenticated ? '🌍 SPARK' : 'SPARK'}
                </h1>
              </div>
              <div className="flex items-center space-x-3">
                {isAuthenticated ? (
                  <div className="flex items-center space-x-3">
                    <a href="/feed" className={`text-sm font-medium ${pathname === '/feed' ? 'text-red-600' : 'text-gray-600 hover:text-red-600'}`}>
                      Фид
                    </a>
                    <a href="/profile" className={`text-sm font-medium ${pathname === '/profile' ? 'text-red-600' : 'text-gray-600 hover:text-red-600'}`}>
                      Профиль
                    </a>
                    <button onClick={handleLogout} className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white text-sm">
                      Выход
                    </button>
                  </div>
                ) : (
                  <a href="/login" className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm">
                    Войти
                  </a>
                )}
              </div>
            </div>
          </nav>
        </header>
      </div>

      <main className="min-h-screen">
        {children}
      </main>
    </>
  );
}
