'use client';

import { useRouter, usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  showAppBar?: boolean;
}

export default function Layout({ children, showAppBar = true }: LayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  const navigation = [
    {
      icon: '🏠',
      label: 'Главная',
      path: '/feed',
      active: pathname === '/feed'
    },
    {
      icon: '🔍',
      label: 'Поиск',
      path: '/search',
      active: pathname === '/search'
    },
    {
      icon: '➕',
      label: 'Создать',
      path: '/create',
      active: pathname === '/create'
    },
    {
      icon: '💬',
      label: 'Сообщения',
      path: '/messages',
      active: pathname === '/messages'
    },
    {
      icon: '👤',
      label: 'Профиль',
      path: '/profile',
      active: pathname === '/profile'
    }
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {showAppBar && (
        /* AppBar */
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 sticky top-0 z-10">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">🌍 Spark</h1>
            <div className="flex space-x-4 text-gray-600 dark:text-gray-400">
              <span>🔍</span>
              <span className="text-green-600">📊 9.8</span>
              <span>🕊️</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {children}

      {/* Bottom Navigation for Authenticated users */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 lg:hidden">
        <div className="flex justify-around items-center py-3 max-w-md mx-auto">
          {navigation.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className="flex flex-col items-center space-y-1"
            >
              <span className="text-xl">{item.icon}</span>
              <span className={`text-xs font-medium ${item.active ? 'text-red-600' : 'text-gray-600 dark:text-gray-400'}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
