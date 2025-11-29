// Маршруты сообщений для Spark
// Конверсации и отправка сообщений через Socket.IO

const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');

// Подключение к БД
const db = new sqlite3.Database('./spark.db');

// Получение конверсации с пользователем
exports.getConversation = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Токен не предоставлен' });
  }

  jwt.verify(token, 'spark_secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Неверный токен' });
    }

    const otherUserId = req.params.userId;

    if (!otherUserId || isNaN(otherUserId)) {
      return res.status(400).json({ error: 'Неверный ID собеседника' });
    }

    // Получение сообщений между двумя пользователями
    db.all(`
      SELECT m.id, m.sender_id, m.receiver_id, m.content, m.created_at,
             u.username, u.fullname
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE (m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?)
      ORDER BY m.created_at ASC
    `, [decoded.id, otherUserId, otherUserId, decoded.id], (err, messages) => {
      if (err) {
        console.error('Ошибка получения сообщений:', err);
        return res.status(500).json({ error: 'Ошибка сервера' });
      }

      // Расшифровка сообщений (реальное AES шифрование)
      messages = messages.map(msg => ({
        ...msg,
        content: require('../index.js').decryptMessage ? require('../index.js').decryptMessage(msg.content) : msg.content
      }));

      res.json({ messages });
    });
  });
};

// Отправка сообщения (дублирует Socket.IO, но для API)
exports.sendMessage = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Токен не предоставлен' });
  }

  jwt.verify(token, 'spark_secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Неверный токен' });
    }

    const { receiver_id, content } = req.body;

    if (!receiver_id || !content) {
      return res.status(400).json({ error: 'Получатель и содержание сообщения обязательны' });
    }

    // Шифрование сообщения
    const encryptedContent = require('../index.js').encryptMessage(content);

    db.run(`INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)`,
      [decoded.id, receiver_id, encryptedContent], function(err) {
        if (err) {
          console.error('Ошибка отправки сообщения:', err);
          return res.status(500).json({ error: 'Ошибка сервера' });
        }

        res.status(201).json({
          message: 'Сообщение отправлено',
          messageId: this.lastID
        });
      });
  });
};
