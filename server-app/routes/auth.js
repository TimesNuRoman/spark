// Маршруты аутентификации для Spark
// Все операции через API, без Firebase Auth

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();

// Подключение к БД
const db = new sqlite3.Database('./spark.db');

// Регистрация пользователя
exports.register = (req, res) => {
  const { email, password, username, fullname } = req.body;

  // Валидация входных данных
  if (!email || !password || !username || !fullname) {
    return res.status(400).json({ error: 'Все поля обязательны для заполнения' });
  }

  // Проверка формата email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Неверный формат email адреса' });
  }

  // Проверка длины полей
  if (username.length < 3 || username.length > 20) {
    return res.status(400).json({ error: 'Имя пользователя должно содержать от 3 до 20 символов' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Пароль должен содержать минимум 8 символов' });
  }

  // Проверка существования пользователя с таким email
  db.get(`SELECT id FROM users WHERE email = ?`, [email], (err, existingUser) => {
    if (err) {
      console.error('Ошибка проверки email:', err);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }

    if (existingUser) {
      return res.status(409).json({ error: 'Пользователь с таким email уже существует' });
    }

    // Проверка существования пользователя с таким username
    db.get(`SELECT id FROM users WHERE username = ?`, [username], (err, existingUsername) => {
      if (err) {
        console.error('Ошибка проверки username:', err);
        return res.status(500).json({ error: 'Ошибка сервера' });
      }

      if (existingUsername) {
        return res.status(409).json({ error: 'Имя пользователя уже используется' });
      }

      // Если все проверки прошли, начинаем регистрацию
      // Шифрование пароля
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          console.error('Ошибка хеширования:', err);
          return res.status(500).json({ error: 'Ошибка сервера' });
        }

        // Сохранение в БД
        db.run(`INSERT INTO users (email, password, username, fullname) VALUES (?, ?, ?, ?)`,
          [email, hashedPassword, username, fullname], function(err) {
            if (err) {
              console.error('Ошибка регистрации:', err);
              return res.status(500).json({ error: 'Ошибка регистрации пользователя' });
            }

            // Генерация JWT токена
            const token = jwt.sign({ id: this.lastID, email }, 'spark_secret_key', { expiresIn: '7d' });

            res.status(201).json({
              message: 'Пользователь зарегистрирован',
              user: { id: this.lastID, email, username, fullname },
              token
            });
          });
      });
    });
  });
};

// Вход пользователя
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email и пароль обязательны' });
  }

  // Поиск пользователя
  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
    if (err) {
      console.error('Ошибка поиска пользователя:', err);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    // Проверка пароля
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('Ошибка проверки пароля:', err);
        return res.status(500).json({ error: 'Ошибка сервера' });
      }

      if (!isMatch) {
        return res.status(401).json({ error: 'Неверный email или пароль' });
      }

      // Генерация токена
      const token = jwt.sign({ id: user.id, email: user.email }, 'spark_secret_key', { expiresIn: '7d' });

      res.json({
        message: 'Вход выполнен',
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          fullname: user.fullname,
          bio: user.bio,
          avatar: user.avatar
        },
        token
      });
    });
  });
};

// Получение профиля (требует аутентификации)
exports.getProfile = (req, res) => {
  // В реальности добавить middleware для проверки токена
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Токен не предоставлен' });
  }

  jwt.verify(token, 'spark_secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Неверный токен' });
    }

    db.get(`SELECT id, email, username, fullname, bio, avatar FROM users WHERE id = ?`, [decoded.id], (err, user) => {
      if (err) {
        console.error('Ошибка получения профиля:', err);
        return res.status(500).json({ error: 'Ошибка сервера' });
      }

      if (!user) {
        return res.status(404).json({ error: 'Пользователь не найден' });
      }

      res.json({ user });
    });
  });
};

// Обновление профиля
exports.updateProfile = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Токен не предоставлен' });
  }

  jwt.verify(token, 'spark_secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Неверный токен' });
    }

    const { fullname, bio, avatar } = req.body;

    db.run(`UPDATE users SET fullname = ?, bio = ?, avatar = ? WHERE id = ?`,
      [fullname, bio, avatar, decoded.id], function(err) {
        if (err) {
          console.error('Ошибка обновления профиля:', err);
          return res.status(500).json({ error: 'Ошибка сервера' });
        }

        res.json({ message: 'Профиль обновлен' });
      });
  });
};

// Регистрация device token для уведомлений
exports.registerDeviceToken = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Токен не предоставлен' });
  }

  jwt.verify(token, 'spark_secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Неверный токен' });
    }

    const { device_token } = req.body;

    if (!device_token || device_token.trim() === '') {
      return res.status(400).json({ error: 'Device token обязателен' });
    }

    // Сохранить или обновить device token в БД
    // Используем UNIQUE на (user_id, token) для предотвращения дубликатов
    db.run(`INSERT OR REPLACE INTO device_tokens (user_id, token) VALUES (?, ?)`,
      [decoded.id, device_token.trim()], function(err) {
        if (err) {
          console.error('Ошибка сохранения device token:', err);
          return res.status(500).json({ error: 'Ошибка сервера' });
        }

        console.log(`Device token зарегистрирован для пользователя ${decoded.id}: ${device_token}`);
        res.json({ message: 'Device token зарегистрирован' });
      });
  });
};
