// Маршруты лайков для Spark
// Лайки постам

const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');

// Подключение к БД
const db = new sqlite3.Database('./spark.db');

// Получить статус лайка пользователя для поста
exports.getLikeStatus = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Токен не предоставлен' });
  }

  jwt.verify(token, 'spark_secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Неверный токен' });
    }

    const postId = req.params.postId;

    db.get(`SELECT id FROM likes WHERE post_id = ? AND user_id = ?`, [postId, decoded.id], (err, like) => {
      if (err) {
        console.error('Ошибка получения статуса лайка:', err);
        return res.status(500).json({ error: 'Ошибка сервера' });
      }

      res.json({ isLiked: !!like });
    });
  });
};

// Добавить или убрать лайк
exports.toggleLike = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Токен не предоставлен' });
  }

  jwt.verify(token, 'spark_secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Неверный токен' });
    }

    const postId = req.params.postId;

    if (!postId || isNaN(postId)) {
      return res.status(400).json({ error: 'Неверный ID поста' });
    }

    // Проверить, есть ли уже лайк
    db.get(`SELECT id FROM likes WHERE post_id = ? AND user_id = ?`, [postId, decoded.id], (err, like) => {
      if (err) {
        console.error('Ошибка проверки лайка:', err);
        return res.status(500).json({ error: 'Ошибка сервера' });
      }

      if (like) {
        // Убрать лайк
        db.run(`DELETE FROM likes WHERE id = ?`, [like.id], function(err) {
          if (err) {
            console.error('Ошибка удаления лайка:', err);
            return res.status(500).json({ error: 'Ошибка сервера' });
          }

          // Получить новый счетчик лайков
          db.get(`SELECT COUNT(*) as count FROM likes WHERE post_id = ?`, [postId], (err, count) => {
            res.json({ action: 'unliked', likeCount: count.count });
          });
        });
      } else {
        // Добавить лайк
        db.run(`INSERT INTO likes (post_id, user_id) VALUES (?, ?)`, [postId, decoded.id], function(err) {
          if (err) {
            console.error('Ошибка добавления лайка:', err);
            return res.status(500).json({ error: 'Ошибка сервера' });
          }

          // Получить новый счетчик лайков
          db.get(`SELECT COUNT(*) as count FROM likes WHERE post_id = ?`, [postId], (err, count) => {
            res.json({ action: 'liked', likeCount: count.count });
          });
        });
      }
    });
  });
};
