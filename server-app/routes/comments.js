// Маршруты комментариев для Spark
// Комментарии к постам

const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');

// Подключение к БД
const db = new sqlite3.Database('./spark.db');

// Получение комментариев к посту
exports.getComments = (req, res) => {
  const postId = req.params.postId;

  if (!postId || isNaN(postId)) {
    return res.status(400).json({ error: 'Неверный ID поста' });
  }

  db.all(`
    SELECT c.id, c.content, c.created_at,
           u.username, u.fullname, u.avatar
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.post_id = ?
    ORDER BY c.created_at DESC
    LIMIT 50
  `, [postId], (err, comments) => {
    if (err) {
      console.error('Ошибка получения комментариев:', err);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }

    res.json({ comments });
  });
};

// Добавление комментария
exports.addComment = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Токен не предоставлен' });
  }

  jwt.verify(token, 'spark_secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Неверный токен' });
    }

    const { post_id, content } = req.body;

    if (!post_id || !content) {
      return res.status(400).json({ error: 'Post ID и контент комментария обязательны' });
    }

    db.run(`INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)`,
      [post_id, decoded.id, content], function(err) {
        if (err) {
          console.error('Ошибка добавления комментария:', err);
          return res.status(500).json({ error: 'Ошибка сервера' });
        }

        res.status(201).json({
          message: 'Комментарий добавлен',
          commentId: this.lastID
        });
      });
  });
};

// Удаление комментария (только свой или админа)
exports.deleteComment = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Токен не предоставлен' });
  }

  jwt.verify(token, 'spark_secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Неверный токен' });
    }

    const commentId = req.params.commentId;

    // Проверить, что пользователь владеет комментарием
    db.get(`SELECT user_id FROM comments WHERE id = ?`, [commentId], (err, comment) => {
      if (err) {
        console.error('Ошибка проверки комментария:', err);
        return res.status(500).json({ error: 'Ошибка сервера' });
      }

      if (!comment) {
        return res.status(404).json({ error: 'Комментарий не найден' });
      }

      if (comment.user_id !== decoded.id) {
        return res.status(403).json({ error: 'Нет прав на удаление этого комментария' });
      }

      db.run(`DELETE FROM comments WHERE id = ?`, [commentId], function(err) {
        if (err) {
          console.error('Ошибка удаления комментария:', err);
          return res.status(500).json({ error: 'Ошибка сервера' });
        }

        res.json({ message: 'Комментарий удален' });
      });
    });
  });
};
