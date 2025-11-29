'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const posts = [
    {
      id: 1,
      title: "Это новое в мире технологий",
      content: "Мы создаем инструменты, которые помогают понять суть вещей через призму инноваций.",
      category: "Научный прогресс",
      categoryEmoji: "🔬"
    },
    {
      id: 2,
      title: "Культурный мост народов",
      content: "Искусство объединяет людей разных культур в уникальном диалоге творчества.",
      category: "Культурный мост",
      categoryEmoji: "🌍"
    },
    {
      id: 3,
      title: "Новый талант поколений",
      content: "Откройте для себя музыкантов, художников и творцов, которые меняют наше восприятие искусства.",
      category: "Новый талант",
      categoryEmoji: "🎵"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % posts.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [posts.length]);

  return (
    <div className="relative max-w-sm mx-auto">
      <div className="overflow-hidden rounded-xl bg-white border border-gray-100 shadow-sm">
        {posts.map((post, index) => (
          <div
            key={post.id}
            className={`transition-opacity duration-500 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0 absolute inset-0'
            }`}
          >
            <div className="p-6">
              {/* Category badge */}
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-lg">{post.categoryEmoji}</span>
                <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                  {post.category}
                </span>
              </div>

              {/* Post content */}
              <h3 className="text-lg font-medium text-gray-900 mb-3 leading-tight">
                {post.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                {post.content}
              </p>

              {/* Actions */}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex space-x-4">
                  <span>❤️</span>
                  <span>💬</span>
                  <span>↗️</span>
                </div>
                <span>1289 вовлечено</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center space-x-2 mt-4">
        {posts.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-gray-900' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function WelcomeHome() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate minimal loading for clean experience
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleAction = (path: string) => {
    router.push(path);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-light text-gray-900 mb-4">Spark</div>
          <div className="animate-pulse text-gray-500 text-sm">Инициализация...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Clean white space layout */}
      <div className="max-w-md mx-auto px-6 py-16">

        {/* Minimal header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-light text-gray-900 tracking-wide mb-3">Spark</h1>
          <p className="text-gray-600 leading-relaxed max-w-xs mx-auto">
            Контент, который понимает вас лучше, чем вы сами
          </p>
        </div>

        {/* Welcome message */}
        <div className="text-center mb-16">
          <p className="text-lg text-gray-700 leading-relaxed">
            Откройте для себя социальную сеть нового поколения
          </p>
          <p className="text-sm text-gray-500 mt-4 leading-relaxed max-w-sm mx-auto">
            Где алгоритмы работают только на вас, а приватность священна
          </p>
        </div>

        {/* Posts Carousel - Platform Functionality Demo */}
        <div className="mb-16">
          <Carousel />
        </div>

        {/* Feature Highlights */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-lg font-semibold text-gray-900">Возможности Spark</h3>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div className="text-center">
              <div className="text-2xl mb-1">🤖</div>
              <div className="text-gray-600">AI Mind-Reading</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">🔒</div>
              <div className="text-gray-600">Signal Security</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">📊</div>
              <div className="text-gray-600">Analytics 9.8</div>
            </div>
          </div>
        </div>

        {/* Auth buttons */}
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <button
              onClick={() => handleAction('/login')}
              className="w-full py-4 px-6 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Войти
            </button>
            <button
              onClick={() => handleAction('/register')}
              className="w-full py-4 px-6 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Создать аккаунт
            </button>
          </div>

          {/* Debug button - remove in production */}
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="text-xs text-gray-400 underline hover:text-gray-600"
          >
            Очистить данные и перезагрузить
          </button>
        </div>

      </div>
    </div>
  );
}
