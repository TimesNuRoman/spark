// Маршруты постов для Spark
// Лента, отдельный пост, создание поста

const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');

// Подключение к БД
const db = new sqlite3.Database('./spark.db');

// Получение ленты постов
exports.getFeed = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  let userId = null;
  if (token) {
    try {
      const decoded = jwt.verify(token, 'spark_secret_key');
      userId = decoded.id;
    } catch (err) {
      // Игнорируем, если токен неверный
    }
  }

  try {
    // Получение постов с информацией о пользователе
    const posts = await new Promise((resolve, reject) => {
      db.all(`
        SELECT p.id, p.title, p.content, p.category, p.media_urls, p.created_at,
               u.username, u.fullname, u.avatar
        FROM posts p
        JOIN users u ON p.user_id = u.id
        ORDER BY p.created_at DESC
        LIMIT 50
      `, [], (err, posts) => {
        if (err) reject(err);
        else resolve(posts);
      });
    });

    const postIds = posts.map(p => p.id);
    const placeholders = postIds.map(() => '?').join(',');

    // Получение лайков и комментариев
    const [likesData, commentsData] = await Promise.all([
      new Promise(resolve => {
        if (postIds.length === 0) return resolve([]);
        db.all(`SELECT post_id, COUNT(*) as like_count FROM likes WHERE post_id IN (${placeholders}) GROUP BY post_id`, postIds, (err, data) => {
          resolve(err ? [] : data);
        });
      }),
      new Promise(resolve => {
        if (postIds.length === 0) return resolve([]);
        db.all(`SELECT post_id, COUNT(*) as comment_count FROM comments WHERE post_id IN (${placeholders}) GROUP BY post_id`, postIds, (err, data) => {
          resolve(err ? [] : data);
        });
      })
    ]);

    // Мапы для статистики
    const likesMap = {};
    likesData.forEach(like => likesMap[like.post_id] = like.like_count);

    const commentsMap = {};
    commentsData.forEach(comment => commentsMap[comment.post_id] = comment.comment_count);

    // Проверка лайков пользователя
    let userLikesMap = {};
    if (userId && postIds.length > 0) {
      const userLikes = await new Promise(resolve => {
        db.all(`SELECT post_id FROM likes WHERE user_id = ? AND post_id IN (${placeholders})`, [userId, ...postIds], (err, data) => {
          resolve(err ? [] : data);
        });
      });
      userLikesMap = {};
      userLikes.forEach(like => userLikesMap[like.post_id] = true);
    }

    // Формирование ответа
    const feedPosts = posts.map(post => {
      const likeCount = likesMap[post.id] || 0;
      const commentCount = commentsMap[post.id] || 0;
      const engagementCount = likeCount + commentCount;

      return {
        id: post.id,
        title: post.title,
        content: post.content,
        category: post.category,
        media_urls: post.media_urls ? JSON.parse(post.media_urls) : [],
        created_at: post.created_at,
        user: {
          username: post.username,
          fullname: post.fullname,
          avatar: post.avatar
        },
        likeCount,
        commentCount,
        engagementCount,
        userLiked: userLikesMap[post.id] || false
      };
    });

    // Mind-reading hooks
    const hooksMap = {
      'Культурный мост': "Это укрепит связи между народами",
      'Новый талант': "Откройте для себя новое в искусстве",
      'Научный прогресс': "Интересные результаты исследований",
      default: "Это заинтересует вас"
    };

    const finalPosts = feedPosts.map(post => ({
      ...post,
      mindReadingHook: hooksMap[post.category] || hooksMap.default
    }));

    res.json({ posts: finalPosts });

  } catch (err) {
    console.error('Ошибка получения ленты:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// Получение отдельного поста
exports.getPost = (req, res) => {
  const postId = req.params.id;

  if (!postId || isNaN(postId)) {
    return res.status(400).json({ error: 'Неверный ID поста' });
  }

  db.get(`
    SELECT p.id, p.title, p.content, p.category, p.media_urls, p.created_at,
           u.username, u.fullname, u.avatar
    FROM posts p
    JOIN users u ON p.user_id = u.id
    WHERE p.id = ?
  `, [postId], (err, post) => {
    if (err) {
      console.error('Ошибка получения поста:', err);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }

    if (!post) {
      return res.status(404).json({ error: 'Пост не найден' });
    }

    // Преобразование media_urls из JSON
    post.media_urls = post.media_urls ? JSON.parse(post.media_urls) : [];

    res.json({ post });
  });
};

// Создание нового поста
exports.createPost = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Токен не предоставлен' });
  }

  jwt.verify(token, 'spark_secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Неверный токен' });
    }

    const { title, content, category, media_urls } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Заголовок и контент обязательны' });
    }

    const mediaJson = media_urls ? JSON.stringify(media_urls) : null;

    db.run(`INSERT INTO posts (user_id, title, content, category, media_urls) VALUES (?, ?, ?, ?, ?)`,
      [decoded.id, title, content, category, mediaJson], function(err) {
        if (err) {
          console.error('Ошибка создания поста:', err);
          return res.status(500).json({ error: 'Ошибка сервера' });
        }

        res.status(201).json({
          message: 'Пост создан',
          postId: this.lastID
        });
      });
  });
};
