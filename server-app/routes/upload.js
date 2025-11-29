// Маршрут загрузки файлов для Spark
// Без Firebase Storage

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

// Настройка multer для хранения файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Создание папки uploads если нет
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Генерация уникального имени файла
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Фильтр типов файлов
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi|pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Неподдерживаемый тип файла'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: fileFilter
});

// Загрузка файла
exports.uploadFile = (req, res) => {
  // Проверка аутентификации
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Токен не предоставлен' });
  }

  jwt.verify(token, 'spark_secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Неверный токен' });
    }

    // Обработка загрузки
    upload.single('file')(req, res, (err) => {
      if (err) {
        console.error('Ошибка загрузки файла:', err);
        return res.status(500).json({ error: 'Ошибка загрузки файла' });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'Файл не загружен' });
      }

      // Возврат URL файла
      const fileUrl = `/uploads/${req.file.filename}`;
      res.json({
        message: 'Файл загружен',
        fileUrl: fileUrl,
        fileName: req.file.originalname,
        fileSize: req.file.size
      });
    });
  });
};

// Загрузка нескольких файлов
exports.uploadMultiple = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Токен не предоставлен' });
  }

  jwt.verify(token, 'spark_secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Неверный токен' });
    }

    upload.array('files', 10)(req, res, (err) => {
      if (err) {
        console.error('Ошибка загрузки файлов:', err);
        return res.status(500).json({ error: 'Ошибка загрузки файлов' });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'Файлы не загружены' });
      }

      const fileUrls = req.files.map(file => `/uploads/${file.filename}`);
      res.json({
        message: 'Файлы загружены',
        fileUrls: fileUrls
      });
    });
  });
};
