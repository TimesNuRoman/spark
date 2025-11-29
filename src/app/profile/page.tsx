'use client';

import Layout from '@/components/Layout';

export default function ProfileDemoPage() {
  return (
    <Layout showAppBar={false}>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="text-gray-900 dark:text-white font-bold">@spark_admin</div>
          <div className="w-8 h-8"></div> {/* Свободное пространство */}
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-6 py-8">
        {/* Big Avatar Center */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-red-400 to-blue-500 rounded-3xl flex items-center justify-center shadow-lg">
              <div className="w-28 h-28 bg-white dark:bg-gray-800 rounded-3xl flex items-center justify-center">
                <span className="text-4xl">👤</span>
              </div>
            </div>
          </div>
        </div>

        {/* Name and Bio */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            🔥 spark_admin 🔥
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">John Doe</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-6 max-w-xs mx-auto">
            Расскажите о себе здесь
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 mb-6">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900 dark:text-white">🔵 128</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Посты</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900 dark:text-white">👁️ 1к</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Подписчики</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900 dark:text-white">👁️ 2.5к</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Просмотры</div>
          </div>
        </div>

        {/* Edit Button */}
        <button className="w-full py-4 bg-white dark:bg-gray-800 border-2 border-red-600 text-red-600 dark:text-red-400 rounded-xl font-semibold hover:bg-red-50 dark:hover:bg-red-950 transition-colors mb-4 flex items-center justify-center">
          📝 Редактировать профиль
        </button>

      </div>

      {/* Tabs */}
      <div className="border-t border-gray-200 dark:border-gray-700">
        <div className="flex">
          <button className="flex-1 py-3 text-center text-red-600 border-b-2 border-red-600">
            Посты
          </button>
          <button className="flex-1 py-3 text-center text-gray-500 dark:text-gray-400">
            Медиа
          </button>
          <button className="flex-1 py-3 text-center text-gray-500 dark:text-gray-400">
            Лайки
          </button>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-3 gap-1 p-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center text-gray-500">
            <span className="text-2xl">
              {i % 3 === 0 ? '🎵' : i % 3 === 1 ? '🌍' : '🔬'}
            </span>
          </div>
        ))}
      </div>

      {/* Messages Placeholder */}
      <div className="p-4 text-center w-full">
        <span className="text-gray-500 dark:text-gray-400 text-sm">╰─ Сообщения скоро будут доступны ─╯</span>
      </div>
    </Layout>
  );
}
