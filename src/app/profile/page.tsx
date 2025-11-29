'use client';

export default function ProfileDemoPage() {
  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-6">
        <div className="flex items-center justify-between">
          <button className="text-gray-600 dark:text-gray-400">
            <span className="text-xl">⬅️</span>
          </button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Spark</h1>
          <button className="text-gray-600 dark:text-gray-400">
            <span className="text-xl">⚙️</span>
          </button>
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-6 pb-6">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-2xl">👤</span>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">@spark_admin</h2>
            <p className="text-gray-600 dark:text-gray-400">John Doe</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              Социальный феномен нового поколения. Мы превзошли все существующие сети.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">128</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Посты</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">🔵 1.2к</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Подписчики</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">👁️ 2.5к</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Просмотры</div>
          </div>
        </div>

        {/* Edit Button */}
        <button className="w-full mt-4 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors">
          Редактировать профиль
        </button>

        {/* Analytics Score */}
        <div className="bg-gradient-to-r from-red-500 to-blue-500 rounded-lg p-4 mt-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Spark Analytics Score</h3>
              <p className="text-sm opacity-90">Лучше Meta на 0.1 пункта</p>
            </div>
            <div className="text-3xl font-bold">9.8</div>
          </div>
        </div>
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
      <div className="p-6 text-center bg-gray-50 dark:bg-gray-800 mt-4 mx-4 rounded-lg">
        <span className="text-gray-500 dark:text-gray-400">Сообщения скоро будут доступны через API</span>
      </div>
    </div>
  );
}
