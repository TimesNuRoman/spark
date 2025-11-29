'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';

type SettingsTab = 'account' | 'notifications' | 'appearance' | 'privacy' | 'storage' | 'about';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');

  const [settings, setSettings] = useState({
    // Account settings
    profile: {
      avatar: 'https://via.placeholder.com/80',
      displayName: user?.fullname || 'Spark User',
      username: user?.username || 'sparkuser',
      bio: 'Full-stack developer & tech enthusiast',
      website: '',
      location: ''
    },
    // Notification settings
    notifications: {
      pushEnabled: true,
      emailDigest: true,
      inAppSounds: false,
      quietHours: false
    },
    // Appearance settings
    appearance: {
      theme: 'light' as 'light' | 'dark' | 'system',
      language: 'ru',
      fontSize: 'medium' as 'small' | 'medium' | 'large'
    },
    // Privacy settings
    privacy: {
      profileVisibility: 'public',
      messagePermission: 'everyone',
      dataSharing: false
    }
  });

  const updateProfile = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      profile: { ...prev.profile, [key]: value }
    }));
  };

  const updateNotifications = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value }
    }));
  };

  const updateAppearance = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      appearance: { ...prev.appearance, [key]: value }
    }));
  };

  const updatePrivacy = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      privacy: { ...prev.privacy, [key]: value }
    }));
  };

  const renderAccountTab = () => (
    <div className="space-y-6">
      {/* Profile Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">👤 Профиль</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <img
              src={settings.profile.avatar}
              alt="Avatar"
              className="w-16 h-16 rounded-full"
            />
            <button className="text-red-600 dark:text-red-400 text-sm font-medium hover:text-red-700">
              Изменить фото
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Отображаемое имя</label>
            <input
              type="text"
              value={settings.profile.displayName}
              onChange={(e) => updateProfile('displayName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Имя пользователя</label>
            <input
              type="text"
              value={settings.profile.username}
              onChange={(e) => updateProfile('username', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Биография</label>
            <textarea
              rows={3}
              value={settings.profile.bio}
              onChange={(e) => updateProfile('bio', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Сайт</label>
            <input
              type="url"
              value={settings.profile.website}
              onChange={(e) => updateProfile('website', e.target.value)}
              placeholder="https://your-website.com"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Privacy Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">🔒 Приватность</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Видимость профиля</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Кто может видеть ваш профиль</p>
            </div>
            <select
              value={settings.privacy.profileVisibility}
              onChange={(e) => updatePrivacy('profileVisibility', e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="public">Публичный</option>
              <option value="friends">Только друзья</option>
              <option value="private">Приватный</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Сообщения</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Кто может писать вам сообщения</p>
            </div>
            <select
              value={settings.privacy.messagePermission}
              onChange={(e) => updatePrivacy('messagePermission', e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="everyone">Все</option>
              <option value="friends">Только друзья</option>
              <option value="nobody">Никто</option>
            </select>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-red-900 dark:text-red-200 mb-4">🚪 Аккаунт</h3>
        <div className="space-y-3">
          <button
            onClick={logout}
            className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Выйти из аккаунта
          </button>
          <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
            Удалить аккаунт
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">🔔 Push уведомления</h3>
        <div className="space-y-4">
          {[
            { key: 'pushEnabled', label: 'Общие уведомления', desc: 'Лайки, комментарии, новые подписчики' },
            { key: 'emailDigest', label: 'Email дайджест', desc: 'Еженедельная сводка активности' },
            { key: 'inAppSounds', label: 'Звуки приложения', desc: 'Звонки и звуковые эффекты' },
            { key: 'quietHours', label: 'Тихий режим', desc: 'Не беспокоить ночью' }
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium">{label}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications[key as keyof typeof settings.notifications]}
                  onChange={(e) => updateNotifications(key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAppearanceTab = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">🎨 Внешний вид</h3>
        <div className="space-y-4">
          <div>
            <p className="font-medium mb-2">Тема</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'light', label: '🌞 Светлая' },
                { value: 'dark', label: '🌙 Темная' },
                { value: 'system', label: '🖥️ Системная' }
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => updateAppearance('theme', value)}
                  className={`px-3 py-2 rounded-lg border transition-colors ${
                    settings.appearance.theme === value
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="font-medium mb-2">Язык</p>
            <select
              value={settings.appearance.language}
              onChange={(e) => updateAppearance('language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="ru">Русский</option>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>

          <div>
            <p className="font-medium mb-2">Размер шрифта</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'small', label: 'Маленький' },
                { value: 'medium', label: 'Средний' },
                { value: 'large', label: 'Большой' }
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => updateAppearance('fontSize', value)}
                  className={`px-3 py-2 rounded-lg border transition-colors ${
                    settings.appearance.fontSize === value
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">🔒 Безопасность</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Двухфакторная аутентификация</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Дополнительная защита аккаунта</p>
            </div>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              Включить
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Ключи устройства</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Управление доверенными устройствами</p>
            </div>
            <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
              Управлять
            </button>
          </div>

          <div>
            <p className="font-medium mb-2">Изменить пароль</p>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
              Изменить пароль
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">📊 Данные</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Экспорт данных</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Скачать все ваши данные</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Экспорт
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Обмен данными</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Помогать улучшать приложение</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.privacy.dataSharing}
                onChange={(e) => updatePrivacy('dataSharing', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStorageTab = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">🌐 Хранилище</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="font-medium">Использовано места</p>
              <span className="text-sm text-gray-600 dark:text-gray-400">1.2 GB из 5 GB</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-red-600 h-2 rounded-full" style={{ width: '24%' }}></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <p className="font-medium">Фото</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">842 MB</p>
            </div>
            <div>
              <p className="font-medium">Видео</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">256 MB</p>
            </div>
            <div>
              <p className="font-medium">Сообщения</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">89 MB</p>
            </div>
            <div>
              <p className="font-medium">Кэш</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">42 MB</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">🧹 Очистка</h3>
        <div className="space-y-3">
          <button className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors">
            Очистить кэш
          </button>
          <button className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors">
            Удалить старые загрузки
          </button>
          <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
            Очистить все данные
          </button>
        </div>
      </div>
    </div>
  );

  const renderAboutTab = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
        <div className="text-6xl mb-4">🚀</div>
        <h3 className="text-xl font-bold mb-2">Spark</h3>
        <p className="text-gray-600 dark:text-gray-400">Лучшая социальная сеть нового поколения</p>
        <p className="text-sm text-gray-500 mt-2">Версия 2.1.0 (Build 2024.1)</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">ℹ️ Информация</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Разработчик</span>
            <span className="text-gray-600 dark:text-gray-400">Spark Team</span>
          </div>
          <div className="flex justify-between">
            <span>Сообщество</span>
            <span className="text-gray-600 dark:text-gray-400">1.2M пользователей</span>
          </div>
          <div className="flex justify-between">
            <span>Рейтинг</span>
            <span className="text-gray-600 dark:text-gray-400">9.8/10 ⭐</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">🔗 Ссылки</h3>
        <div className="space-y-3">
          <button className="w-full text-left bg-gray-100 dark:bg-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            Что нового
          </button>
          <button className="w-full text-left bg-gray-100 dark:bg-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            Центр поддержки
          </button>
          <button className="w-full text-left bg-gray-100 dark:bg-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            Конфиденциальность
          </button>
          <button className="w-full text-left bg-gray-100 dark:bg-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            Условия использования
          </button>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'account' as SettingsTab, label: 'Аккаунт', icon: '👤' },
    { id: 'notifications' as SettingsTab, label: 'Уведомления', icon: '🔔' },
    { id: 'appearance' as SettingsTab, label: 'Внешний вид', icon: '🎨' },
    { id: 'privacy' as SettingsTab, label: 'Приватность', icon: '🔒' },
    { id: 'storage' as SettingsTab, label: 'Хранилище', icon: '🌐' },
    { id: 'about' as SettingsTab, label: 'О приложении', icon: 'ℹ️' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'account': return renderAccountTab();
      case 'notifications': return renderNotificationsTab();
      case 'appearance': return renderAppearanceTab();
      case 'privacy': return renderPrivacyTab();
      case 'storage': return renderStorageTab();
      case 'about': return renderAboutTab();
      default: return renderAccountTab();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between max-w-md mx-auto lg:max-w-none lg:mx-4">
          <div className="flex items-center space-x-3">
            <button className="text-gray-600 dark:text-gray-400">
              <span className="text-xl">⬅️</span>
            </button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Настройки</h1>
          </div>
        </div>
      </div>

      {/* Settings Layout */}
      <div className="max-w-6xl mx-auto lg:flex lg:space-x-6 p-4">
        {/* Tabs Sidebar */}
        <div className="lg:w-64 mb-6 lg:mb-0">
          <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-red-50 dark:bg-red-900/20 border-r-4 border-red-500 text-red-700 dark:text-red-300'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 max-w-md mx-auto lg:max-w-none">
          {renderTabContent()}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 lg:hidden">
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
            <span className="text-xl">⚙️</span>
            <span className="text-xs text-red-600">Настройки</span>
          </div>
        </div>
      </div>
    </div>
  );
}
