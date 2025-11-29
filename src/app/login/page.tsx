'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user) {
      router.push('/feed');
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      router.push('/feed');
    } catch (err: any) {
      // Обработка ошибок от сервера на русском
      let errorMessage = 'Неверный email или пароль';

      if (err.message) {
        if (err.message.includes('email') || err.message.includes('user')) {
          errorMessage = 'Пользователь не найден';
        } else if (err.message.includes('password')) {
          errorMessage = 'Неверный пароль';
        } else if (err.message.includes('banned') || err.message.includes('blocked')) {
          errorMessage = 'Аккаунт заблокирован';
        } else if (err.message.includes('network') || err.message.includes('connection')) {
          errorMessage = 'Ошибка подключения. Попробуйте позже';
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Empty AppBar */}
      <div className="h-16"></div>

      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
        <div className="w-full max-w-sm space-y-8">
          {/* Central SPARK logo */}
          <div className="text-center">
            <div className="text-6xl mb-4">🌟</div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-wider">
              SPARK
            </h1>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="text-center">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Email field */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-lg">📧</span>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Введите email"
                  required
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-red-600 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-lg">🔒</span>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Пароль"
                  required
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-red-600 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Primary button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Входим...
                </>
              ) : (
                'Войти'
              )}
            </button>

            {/* Links */}
            <div className="text-center space-y-2">
              <a href="#" className="text-blue-600 hover:underline text-sm">
                Забыли пароль?
              </a>
              <div className="text-gray-600 dark:text-gray-400 text-sm">
                Нет аккаунта?{' '}
                <a href="/register" className="text-blue-600 hover:underline">
                  Зарегистрироваться
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
