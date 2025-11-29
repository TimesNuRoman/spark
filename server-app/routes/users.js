// Маршруты пользователей для Spark
// Поиск пользователей и получение профиля

const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');

// Подключение к БД
const db = new sqlite3.Database('./spark.db');

// Поиск пользователей
exports.search = (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: 'Введите запрос для поиска' });
  }

  // Поиск по username или fullname
  db.all(`SELECT id, username, fullname FROM users WHERE username LIKE ? OR fullname LIKE ?`,
    [`%${query}%`, `%${query}%`], (err, users) => {
      if (err) {
        console.error('Ошибка поиска:', err);
        return res.status(500).json({ error: 'Ошибка сервера' });
      }

      res.json({ users });
    });
};

// Получение пользователя по ID
exports.getUser = (req, res) => {
  const userId = req.params.id;

  if (!userId || isNaN(userId)) {
    return res.status(400).json({ error: 'Неверный ID пользователя' });
  }

  db.get(`SELECT id, username, fullname, bio, avatar FROM users WHERE id = ?`, [userId], (err, user) => {
    if (err) {
      console.error('Ошибка получения пользователя:', err);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    // Подсчет постов
    db.get(`SELECT COUNT(*) as postCount FROM posts WHERE user_id = ?`, [userId], (err, count) => {
      if (err) {
        console.error('Ошибка подсчета постов:', err);
        user.postCount = 0;
      } else {
        user.postCount = count.postCount;
      }

      res.json({ user });
    });
  });
};
