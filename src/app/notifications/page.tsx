'use client';

import { useState } from 'react';

interface Notification {
  id: number;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  user?: {
    name: string;
    avatar: string;
  };
}

export default function NotificationsPage() {
  const [notifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'like',
      title: 'Новый лайк',
      message: 'Alice Johnson понравилась ваша публикация "Технологии будущего"',
      timestamp: '2 мин назад',
      read: false,
      user: { name: 'Alice Johnson', avatar: 'https://via.placeholder.com/40' }
    },
    {
      id: 2,
      type: 'comment',
      title: 'Новый комментарий',
      message: 'Bob Smith: Отличная статья! Спасибо за полезную информацию.',
      timestamp: '15 мин назад',
      read: false,
      user: { name: 'Bob Smith', avatar: 'https://via.placeholder.com/40' }
    },
    {
      id: 3,
      type: 'follow',
      title: 'Новый подписчик',
      message: 'Charlie Brown подписался на вас',
      timestamp: '1 час назад',
      read: true,
      user: { name: 'Charlie Brown', avatar: 'https://via.placeholder.com/40' }
    },
    {
      id: 4,
      type: 'mention',
      title: 'Упоминание',
      message: 'Diana Prince упомянула вас в публикации',
      timestamp: '2 часа назад',
      read: true,
      user: { name: 'Diana Prince', avatar: 'https://via.placeholder.com/40' }
    },
    {
      id: 5,
      type: 'system',
      title: 'Система Spark',
      message: 'Добро пожаловать в Spark! Начните с создания первой публикации.',
      timestamp: '1 день назад',
      read: true
    }
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like': return '❤️';
      case 'comment': return '💬';
      case 'follow': return '👤';
      case 'mention': return '🏷️';
      case 'system': return '🔔';
      default: return '📢';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'like': return 'text-red-600';
      case 'comment': return 'text-blue-600';
      case 'follow': return 'text-green-600';
      case 'mention': return 'text-purple-600';
      case 'system': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button className="text-gray-600 dark:text-gray-400">
            <span className="text-xl">⬅️</span>
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Notifications</h1>
        </div>
        {unreadCount > 0 && (
          <div className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {['All', 'Likes', 'Comments', 'Follows'].map((filter) => (
          <button
            key={filter}
            className="flex-1 py-3 text-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-red-600 hover:border-red-600 transition-colors border-b-2 border-transparent"
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer ${
              !notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
            }`}
          >
            <div className="flex items-start space-x-3">
              {/* Icon */}
              <div className={`text-xl ${getNotificationColor(notification.type)}`}>
                {notification.user ? (
                  <img
                    src={notification.user.avatar}
                    alt={notification.user.name}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <span>{getNotificationIcon(notification.type)}</span>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {notification.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {notification.message}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {notification.timestamp}
                </p>
              </div>

              {/* Unread Indicator */}
              {!notification.read && (
                <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2"></div>
              )}
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="text-4xl mb-4">🔔</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No notifications yet
            </h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              When you get notifications, they'll show up here
            </p>
          </div>
        )}
      </div>

      {/* Empty State for many read */}
      {notifications.filter(n => !n.read).length === 0 && notifications.length > 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            All caught up!
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            You have no new notifications. We'll let you know when something happens.
          </p>
          <button className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors">
            Explore Spark
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="sticky bottom-16 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            Mark all as read
          </button>
          <button className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 py-2 px-4 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
            Clear all
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-around items-center py-3 max-w-md mx-auto">
          <div className="flex flex-col items-center space-y-1">
            <span className="text-xl">🏠</span>
            <span className="text-xs text-gray-600 dark:text-gray-400">Главная</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <span className="text-xl">🔍</span>
            <span className="text-xs text-gray-600 dark:text-gray-400">Поиск</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <span className="text-xl">➕</span>
            <span className="text-xs text-gray-600 dark:text-gray-400">Создать</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <span className="text-xl">💬</span>
            <span className="text-xs text-gray-600 dark:text-gray-400">Сообщения</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <span className="text-xl">👤</span>
            <span className="text-xs text-gray-600 dark:text-gray-400">Профиль</span>
          </div>
        </div>
      </div>
    </div>
  );
}
