'use client';

import { useEffect, useState } from 'react';
import { api, Post } from '@/lib/api';

export default function FeedDemoPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to fetch real data from API
    const fetchFeed = async () => {
      try {
        const response = await api.getFeed();
        setPosts(response.posts);
      } catch (error) {
        console.error('Failed to fetch feed, using demo data:', error);
        // Fallback to demo data if API is not available
        setPosts([
          {
            id: 1,
            title: "Культурный мост между народами",
            content: "Как социальные сети могут объединять культуры мира 🌍",
            category: "Культурный мост",
            media_urls: [],
            created_at: new Date().toISOString(),
            user: {
              username: "spark_admin",
              fullname: "Spark Admin",
              avatar: "https://via.placeholder.com/50"
            },
            likeCount: 42,
            commentCount: 15,
            engagementCount: 57,
            userLiked: false,
            mindReadingHook: "Это укрепит связи между народами"
          },
          {
            id: 2,
            title: "Новый талант в мировой музыке",
            content: "Откройте для себя HYPNOTIZED - гаражный талант из России!",
            category: "Новый талант",
            media_urls: ["https://via.placeholder.com/400x300"],
            created_at: new Date(Date.now() - 3600000).toISOString(),
            user: {
              username: "music_promoter",
              fullname: "Музыкальный Промоутер",
              avatar: "https://via.placeholder.com/50"
            },
            likeCount: 128,
            commentCount: 24,
            engagementCount: 152,
            userLiked: true,
            mindReadingHook: "Другие с похожими интересами слушают это"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  return (
    <div className="max-w-md mx-auto lg:max-w-4xl xl:max-w-6xl lg:mx-auto bg-white dark:bg-gray-900 min-h-screen pb-20 lg:pb-0">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Spark Feed</h1>
          <div className="flex space-x-4 text-gray-600 dark:text-gray-400">
            <span>🔍</span>
            <span>📊 9.8</span>
            <span>🕊️</span>
          </div>
        </div>

        {/* Mind-reading banner */}
        <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🤖</span>
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-200">Spark читает вашу душу...</p>
              <p className="text-xs text-blue-700 dark:text-blue-300">Мы создаем мир, где вы еще не думали существовать</p>
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-4 p-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Category label */}
            <div className="flex justify-between items-center p-4 pb-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-blue-500 rounded-full flex items-center justify-center">
                  <img
                    src={post.user.avatar}
                    alt={post.user.username}
                    className="w-8 h-8 rounded-full"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{post.user.username}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(post.created_at).toLocaleDateString('ru-RU')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">
                  {post.category === 'Культурный мост' ? '🌍' : '🎵'} {post.category}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-4 pb-3">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {post.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                {post.content}
              </p>
            </div>

            {/* Mind-reading hook */}
            <div className="px-4 pb-3">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-3 rounded">
                <div className="flex items-center space-x-2">
                  <span>💡</span>
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    {post.mindReadingHook}
                  </p>
                </div>
              </div>
            </div>

            {/* Media */}
            {post.media_urls.length > 0 && (
              <div className="px-4 pb-3">
                <div className="grid grid-cols-1 gap-2">
                  {post.media_urls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Media ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="px-4 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <button className={`flex items-center space-x-2 ${post.userLiked ? 'text-red-600' : 'text-gray-600 dark:text-gray-400'}`}>
                    <span className="text-xl">{post.userLiked ? '❤️' : '🤍'}</span>
                    <span className="text-sm font-medium">{post.likeCount}</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <span className="text-xl">💬</span>
                    <span className="text-sm font-medium">{post.commentCount}</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <span className="text-xl">↗️</span>
                  </button>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {post.engagementCount} вовлечено
                </div>
              </div>
            </div>

            {/* Comments preview */}
            <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Посмотреть {post.commentCount} комментариев</span>
                </div>
                <div className="text-sm text-gray-800 dark:text-gray-200">
                  <span className="font-medium">user1</span> Потрясающе! 👍
                </div>
                <div className="text-sm text-gray-800 dark:text-gray-200">
                  <span className="font-medium">user2</span> Согласна, это меняет взгляд на вещи 🌍
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-around items-center py-3 max-w-md mx-auto">
          <div className="flex flex-col items-center space-y-1">
            <span className="text-xl">🏠</span>
            <span className="text-xs text-red-600">Главная</span>
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
