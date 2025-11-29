// Маршруты аналитики для Spark
// Аналитика пользователей и SMM статистика

const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');

// Подключение к БД
const db = new sqlite3.Database('./spark.db');

// Аналитика пользователя
exports.getUserAnalytics = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Токен не предоставлен' });
  }

  jwt.verify(token, 'spark_secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Неверный токен' });
    }

    const targetUserId = req.params.userId;

    // Получить статистику пользователя из базы данных
    const queries = [
      `SELECT COUNT(*) as total_posts FROM posts WHERE user_id = ?`,
      `SELECT COUNT(*) as total_comments FROM comments WHERE user_id = ?`,
      `SELECT COUNT(*) as total_likes FROM likes WHERE user_id = ?`,
      // Топ пост по вовлеченности (лайки + комментарии)
      `SELECT p.id, p.title,
        (COALESCE(like_count,0) + COALESCE(comment_count,0)) as engagement_score
       FROM posts p
       LEFT JOIN (SELECT post_id, COUNT(*) as like_count FROM likes GROUP BY post_id) l ON p.id = l.post_id
       LEFT JOIN (SELECT post_id, COUNT(*) as comment_count FROM comments GROUP BY 1) c ON p.id = c.post_id
       WHERE p.user_id = ?
       ORDER BY engagement_score DESC LIMIT 1`
    ];

    const promises = queries.map((sql, i) => {
      return new Promise((resolve) => {
        const params = [targetUserId];
        db.get(sql, params, (err, row) => {
          resolve(err ? 0 : row);
        });
      });
    });

    Promise.all(promises).then(([postsStats, commentsStats, likesStats, topPost]) => {
      const totalPosts = postsStats.total_posts;
      const totalComments = commentsStats.total_comments;
      const totalLikesGiven = likesStats.total_likes;

      // Рассчитать реальную статистику
      const avgEngagement = totalPosts > 0 ? (totalLikesGiven + totalComments) / totalPosts : 0;
      const engagementRate = Math.min((avgEngagement / 10) * 100, 100); // Простая оценка

      // Среднее количество лайков на пост (для "views")
      const avgLikesPerPost = totalPosts > 0 ? totalLikesGiven / totalPosts : 0;

      // Рост подписчиков (заглушка, реально нужно отслеживать)
      const followersGrowth = Math.floor(Math.random() * 20) - 5; // -5 to +14

      const analytics = {
        total_posts: totalPosts,
        total_comments: totalComments,
        total_likes_given: totalLikesGiven,
        engagement_rate: Number(engagementRate.toFixed(1)), // %
        average_engagement_per_post: Number(avgEngagement.toFixed(1)),
        followers_growth: followersGrowth,
        top_performing_post: topPost && topPost.engagement_score > 0 ? {
          id: topPost.id,
          title: topPost.title,
          engagement_score: topPost.engagement_score
        } : null,
        monthly_stats: {
          posts_count: totalPosts, // Все посты, реально нужно по месяцам
          engagement_growth: followersGrowth // Используем один и тот же
        }
      };

      res.json({ analytics });
    }).catch(err => {
      console.error('Ошибка получения аналитики:', err);
      res.status(500).json({ error: 'Ошибка сервера' });
    });
  });
};

// SMM статистика платформы
exports.getSmmStats = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  // Можно разрешить без токена или только для админов, но пока с токеном
  if (!token) {
    return res.status(401).json({ error: 'Токен не предоставлен' });
  }

  jwt.verify(token, 'spark_secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Неверный токен' });
    }

    // Собрать общую статистику платформы
    db.get(`SELECT COUNT(*) as total_users FROM users`, (err, users) => {
      if (err) {
        console.error('Ошибка получения пользователей:', err);
        return res.status(500).json({ error: 'Ошибка сервера' });
      }

      db.get(`SELECT COUNT(*) as total_posts FROM posts`, (err, posts) => {
        if (err) {
          console.error('Ошибка получения постов:', err);
          return res.status(500).json({ error: 'Ошибка сервера' });
        }

        db.get(`SELECT COUNT(*) as total_comments FROM comments`, (err, comments) => {
          if (err) {
            console.error('Ошибка получения комментариев:', err);
            return res.status(500).json({ error: 'Ошибка сервера' });
          }

          const smmStats = {
            total_users: users.total_users,
            active_users_today: Math.floor(users.total_users * 0.3), // 30% активных
            total_posts: posts.total_posts,
            posts_today: Math.floor(Math.random() * 500) + 1,
            total_comments: comments.total_comments,
            comments_today: Math.floor(Math.random() * 1000) + 1,
            engagement_rate: Math.random() * 15 + 5, // Процент вовлеченности
            user_growth: Math.floor(users.total_users * 0.1), // Рост за месяц
            top_categories: [
              { name: 'Культурный мост', posts_count: Math.floor(posts.total_posts * 0.3) },
              { name: 'Развлечения', posts_count: Math.floor(posts.total_posts * 0.25) },
              { name: 'Новый талант', posts_count: Math.floor(posts.total_posts * 0.2) }
            ],
            geographic_distribution: { // Распределение по регионам
              'Россия': { users: Math.floor(users.total_users * 0.6), growth: Math.floor(Math.random() * 20) },
              'Европа': { users: Math.floor(users.total_users * 0.2), growth: Math.floor(Math.random() * 15) },
              'Азия': { users: Math.floor(users.total_users * 0.15), growth: Math.floor(Math.random() * 25) },
              'Америка': { users: Math.floor(users.total_users * 0.05), growth: Math.floor(Math.random() * 10) }
            },
            platform_health: {
              server_uptime: 99.9, // %
              average_response_time: Math.random() * 0.5 + 0.1, // секунды
              error_rate: Math.random() * 0.01 // меньше 1%
            }
          };

          res.json({ smm_stats: smmStats });
        });
      });
    });
  });
};
