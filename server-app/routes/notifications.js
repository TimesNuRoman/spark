// Маршруты уведомлений для Spark
// Получение уведомлений без FCM

const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');

// Подключение к БД
const db = new sqlite3.Database('./spark.db');

// Получение уведомлений пользователя
exports.getNotifications = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Токен не предоставлен' });
  }

  jwt.verify(token, 'spark_secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Неверный токен' });
    }

    // Получение уведомлений для пользователя
    db.all(`SELECT id, type, message, created_at FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20`,
      [decoded.id], (err, notifications) => {
        if (err) {
          console.error('Ошибка получения уведомлений:', err);
          return res.status(500).json({ error: 'Ошибка сервера' });
        }

        res.json({ notifications });
      });
  });
};

// В будущем можно добавить функцию для отправки уведомлений другим пользователям
// exports.sendNotification = (req, res) => { ... };
