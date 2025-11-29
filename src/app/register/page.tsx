'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { register } = useAuth();
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (formData.password.length < 8) {
      setError('Пароль должен содержать минимум 8 символов');
      return;
    }

    if (!agreeTerms) {
      setError('Необходимо согласиться с условиями использования');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        fullname: formData.username // Use username as fullname for simplicity
      };
      await register(data);
      setSuccess(true);
      setTimeout(() => router.push('/feed'), 2000);
    } catch (err: any) {
      // Обработка ошибок от сервера на русском
      let errorMessage = 'Ошибка регистрации. Попробуйте снова.';

      if (err.message) {
        if (err.message.includes('email')) {
          errorMessage = 'Неверный формат email';
        } else if (err.message.includes('username')) {
          errorMessage = 'Имя пользователя уже используется';
        } else if (err.message.includes('password')) {
          errorMessage = 'Пароль слишком слабый';
        } else if (err.message.includes('already exists')) {
          errorMessage = 'Пользователь с таким email уже существует';
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
      {/* Header with back */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <span>←</span>
          <span>Создать аккаунт</span>
        </button>
      </div>

      <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] px-4">
        <div className="w-full max-w-sm space-y-6">
          {/* Title */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Создать аккаунт
            </h1>
          </div>

          {success ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">✅</div>
              <p className="text-gray-600 dark:text-gray-400">Аккаунт успешно создан!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="text-center">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Username field */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-lg">👤</span>
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Имя пользователя"
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-blue-600 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Email field */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-lg">✉️</span>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email адрес"
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-blue-600 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
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
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Пароль"
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-blue-600 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Confirm Password field */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-lg">🔒</span>
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Подтвердить пароль"
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-blue-600 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Terms checkbox */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  disabled={loading}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Я согласен с Условиями и Политикой конфиденциальности
                </span>
              </div>

              {/* Create Account button */}
              <button
                type="submit"
                disabled={loading || !agreeTerms}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Создание аккаунта...
                  </>
                ) : (
                  'Создать аккаунт'
                )}
              </button>
            </form>
          )}

          {/* Already have account link */}
          <div className="text-center">
            <a href="/login" className="text-blue-600 hover:underline text-sm">
              Уже есть аккаунт? Войти
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
