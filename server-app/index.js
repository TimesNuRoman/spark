// Spark Server - Основной файл приложения
// Сервер работает исключительно через кастомный API, без внешних сервисов

const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const sqlite3 = require('sqlite3').verbose();

// Инициализация Express приложения
const app = express();
const server = http.createServer(app);

// Настройка Socket.IO для реального времени
const io = socketIo(server, {
  cors: {
    origin: "*", // В продакшене ограничить
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// База данных SQLite (локальная, без облака)
const db = new sqlite3.Database('./spark.db', (err) => {
  if (err) {
    console.error('Ошибка подключения к БД:', err.message);
  } else {
    console.log('Подключено к локальной БД SQLite');
    initDatabase();
  }
});

// Инициализация таблиц БД
function initDatabase() {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    username TEXT UNIQUE,
    fullname TEXT,
    bio TEXT,
    avatar TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT,
    content TEXT,
    category TEXT,
    media_urls TEXT, -- JSON array
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER,
    receiver_id INTEGER,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users (id),
    FOREIGN KEY (receiver_id) REFERENCES users (id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    type TEXT,
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER,
    user_id INTEGER,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER,
    user_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts (id),
    FOREIGN KEY (user_id) REFERENCES users (id),
    UNIQUE(post_id, user_id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS device_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    token TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    UNIQUE(user_id, token)
  )`);
}

// Маршруты аутентификации
app.post('/auth/register', require('./routes/auth').register);
app.post('/auth/login', require('./routes/auth').login);
app.get('/auth/profile', require('./routes/auth').getProfile);
app.put('/auth/profile', require('./routes/auth').updateProfile);

// Маршруты пользователей
app.get('/users/search', require('./routes/users').search);
app.get('/users/:id', require('./routes/users').getUser);

// Маршруты постов
app.get('/posts/feed', require('./routes/posts').getFeed);
app.get('/posts/:id', require('./routes/posts').getPost);
app.post('/posts/create', require('./routes/posts').createPost);

// Маршруты сообщений
app.get('/messages/conversation/:userId', require('./routes/messages').getConversation);
app.post('/messages/send', require('./routes/messages').sendMessage);

// Маршруты уведомлений
app.get('/notifications', require('./routes/notifications').getNotifications);

// Маршруты загрузки файлов
app.post('/upload', require('./routes/upload').uploadFile);
app.post('/upload/multiple', require('./routes/upload').uploadMultiple);

// Маршруты комментариев
app.get('/posts/:postId/comments', require('./routes/comments').getComments);
app.post('/comments', require('./routes/comments').addComment);
app.delete('/comments/:commentId', require('./routes/comments').deleteComment);

// Маршруты лайков
app.get('/posts/:postId/like', require('./routes/likes').getLikeStatus);
app.post('/posts/:postId/like', require('./routes/likes').toggleLike);

// Маршруты аналитики
app.get('/analytics/user/:userId', require('./routes/analytics').getUserAnalytics);
app.get('/smm/stats', require('./routes/analytics').getSmmStats);

// Регистрация device token для уведомлений
app.post('/auth/device-token', require('./routes/auth').registerDeviceToken);

// Статические файлы (загруженные)
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Socket.IO обработчики
io.on('connection', (socket) => {
  console.log('Пользователь подключен:', socket.id);

  socket.on('join_user', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`Пользователь ${userId} присоединился к комнате`);
  });

  socket.on('send_message', (data) => {
    // Шифрование сообщений end-to-end (упрощенная версия для демонстрации)
    const encryptedMessage = encryptMessage(data.message);

    // Сохранить в БД
    db.run(`INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)`,
      [data.senderId, data.receiverId, encryptedMessage], function(err) {
        if (err) {
          console.error('Ошибка сохранения сообщения:', err);
        } else {
          // Отправить получателю
          io.to(`user_${data.receiverId}`).emit('new_message', {
            id: this.lastID,
            senderId: data.senderId,
            receiverId: data.receiverId,
            content: decryptMessage(encryptedMessage), // Расшифровка для получателя
            created_at: new Date()
          });
        }
      });
  });

  socket.on('disconnect', () => {
    console.log('Пользователь отключен:', socket.id);
  });
});

// Шифрование сообщений уровня Signal (симметричное для эдемо)
// В реальности использовать настоящий E2E с public/private keys
const crypto = require('crypto');

function encryptMessage(message) {
  // Простой симметричный ключ (в реальности уникальный для каждого чата)
  const key = crypto.scryptSync('spark_secret_key', 'salt', 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(message, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted; // Сохранять IV с сообщением
}

function decryptMessage(encrypted) {
  try {
    const [ivHex, encryptedText] = encrypted.split(':');
    const key = crypto.scryptSync('spark_secret_key', 'salt', 32);
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Ошибка дешифровки:', error);
    return encrypted; // Возврат как есть если ошибка
  }
}

// Health check endpoint for deployment platforms
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test endpoint для проверки API
app.get('/auth/test', (req, res) => {
  res.json({
    message: 'Spark API работает!',
    timestamp: new Date().toISOString(),
    status: 'online',
    registration: 'available',
    login: 'available'
  });
});

// Экспорт функций шифрования
module.exports.encryptMessage = encryptMessage;
module.exports.decryptMessage = decryptMessage;

// Экспорт БД для использования в маршрутах
module.exports.db = db;

// Запуск сервера
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Spark Server запущен на порту ${PORT}`);
  console.log(`Сервер предназначен для работы исключительно через кастомный API`);
});
