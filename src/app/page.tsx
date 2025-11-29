export default function Home() {
  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl sm:text-7xl font-bold text-gray-900 dark:text-white mb-8">
            SPARK
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Лучшая социальная сеть нового поколения. Мы превзошли все существующие платформы.
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Интеллектуальный Mind-Reading фид, E2E шифрование уровня Signal, аналитика лучше Google Meta.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <a
              href="/login"
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Скачать мобильное приложение
            </a>
            <a
              href="#features"
              className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Узнать больше
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="text-3xl font-bold text-red-600 mb-2">🔍 9.8/10</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Аналитика лучше Meta</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">🔒 100%</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">E2E шифрование</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">🤖 AI</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Чтение ваших интересов</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Наша миссия мирового мира
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Spark борется с ненавистью, дискриминацией и негативными социальными явлениями. Мы создаем инструменты для культурного обмена, поддержки творчества и мирных инициатив.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold mb-2">Культурный мост</h3>
              <p className="text-gray-600 dark:text-gray-400">Связываем народы и культуры</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🎵</div>
              <h3 className="text-xl font-semibold mb-2">Новый талант</h3>
              <p className="text-gray-600 dark:text-gray-400">Продвигаем творчество</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🔬</div>
              <h3 className="text-xl font-semibold mb-2">Научный прогресс</h3>
              <p className="text-gray-600 dark:text-gray-400">Развиваем знания</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🕊️</div>
              <h3 className="text-xl font-semibold mb-2">Мир и прогресс</h3>
              <p className="text-gray-600 dark:text-gray-400">Создаем гармонию</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Уникальные возможности Spark
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Технологии, превышающие все существующие стандарты
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Mind-Reading Feed */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <div className="text-3xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                Mind-Reading Feed
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Алгоритм знает ваши интересы лучше, чем вы сами. Никаких чёрных ящиков ML/AI.
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-500">
                <li>• Прозрачные алгоритмы</li>
                <li>• Персонализация без сбора данных</li>
                <li>• Подбор контента по интересам</li>
              </ul>
            </div>

            {/* E2E Encryption */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <div className="text-3xl mb-4">🔐</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                E2E Шифрование
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Уровень безопасности Signal. AES шифрование всех сообщений и данных.
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-500">
                <li>• Perfect forward secrecy</li>
                <li>• Zero-knowledge архитектура</li>
                <li>• Реальное шифрование</li>
              </ul>
            </div>

            {/* Superior Analytics */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                Аналитика уровня Enterprise
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Лучше Google Meta и Alibaba. Реальные данные, нет фейка.
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-500">
                <li>• Топ-посты по вовлеченности</li>
                <li>• Геолокационная статистика</li>
                <li>• Метрики эффективности</li>
              </ul>
            </div>

            {/* Content Moderation */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <div className="text-3xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                AI Модерация контента
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Современная AI (прозрачная) модерация без цензуры.
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-500">
                <li>• Персонализированные уведомления</li>
                <li>• Умные ответы</li>
                <li>• Стимулирование обсуждений</li>
              </ul>
            </div>

            {/* Global Initiatives */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <div className="text-3xl mb-4">🌟</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                Глобальные инициативы
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Инструменты для мировых идей: free water, борьба с голодом.
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-500">
                <li>• Сбор команд и ресурсов</li>
                <li>• Голосования и финансы</li>
                <li>• Реальные изменения</li>
              </ul>
            </div>

            {/* Real-time Messaging */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                Реальное время
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Мгновенные сообщения через Socket.IO с шифрованием.
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-500">
                <li>• Онлайн статусы</li>
                <li>• Push уведомления</li>
                <li>• Групповые чаты</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Comparison */}
      <section id="analytics" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Аналитика лучше всех конкурентов
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Spark</div>
              <div className="text-4xl font-bold text-green-600 mb-2">9.8</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Идеальная аналитика</p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Meta/Facebook</div>
              <div className="text-4xl font-bold text-red-500 mb-2">9.7</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Устаревшая система</p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Instagram</div>
              <div className="text-4xl font-bold text-red-500 mb-2">9.5</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Поверхностная</p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Twitter/X</div>
              <div className="text-4xl font-bold text-red-500 mb-2">8.2</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Дискриминационная</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-red-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Присоединяйтесь к лучшей социальной сети поколения
          </h2>
          <p className="text-xl mb-8">
            Скачайте Spark прямо сейчас - это бесплатно и безопасно!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/login"
              className="bg-white text-red-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Скачать для Android
            </a>
            <a
              href="/login"
              className="bg-white text-red-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Скачать для iOS
            </a>
          </div>
          <p className="text-sm mt-6 opacity-80">
            Доступно для всех устройств в Google Play и App Store
          </p>
        </div>
      </section>
    </div>
  );
}
