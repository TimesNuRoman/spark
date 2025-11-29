# 🚀 Spark API VPS Deployment Guide

Этот гайд поможет развернуть Spark API сервер на VPS для полной работы сайта.

## 📋 Требования

- VPS с Ubuntu/Debian (метод протестирован на Ubuntu 20.04+)
- Минимум 512MB RAM, 1GB диска
- SSH доступ (предпочтительно with SSH ключ)

## 🛠️ Пошаговая инструкция

### 1. Подготовка VPS

```bash
# Подключитесь к серверу
ssh user@your-vps-ip

# Обновите систему
sudo apt update && sudo apt upgrade -y

# Установите Node.js 18 LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Проверьте установки
node --version  # Должен показать v18.x.x
npm --version   # Должен показать 9.x.x

# Установите PM2 менеджер процессов
sudo npm install -g pm2

# Установите rsync для загрузки файлов (с хоста)
sudo apt install -y rsync
```

### 2. Загрузка кода на сервер

```bash
# На вашем локальном компьютере (j:\Project T)
scp -r server-app/ user@your-vps-ip:/opt/spark-server/

# Или если rsync установлен
rsync -avz server-app/ user@your-vps-ip:/opt/spark-server/
```

### 3. Настройка сервера

```bash
# На VPS сервере
cd /opt/spark-server

# Установите зависимости
npm install --production

# Создайте production конфиг
nano .env
```

Добавьте в `.env`:
```
NODE_ENV=production
PORT=3000
JWT_SECRET=spark_production_secret_2025_secure_key_change_this_in_production
```

### 4. Настройка firewall

```bash
# Разрешите порт 3000
sudo ufw allow 3000
sudo ufw --force enable

# Проверьте статус
sudo ufw status
```

### 5. Запуск сервера

```bash
# В папке /opt/spark-server
pm2 start index.js --name "spark-api"
pm2 save

# Настройте автозапуск
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME

# Проверьте статус
pm2 status
pm2 logs spark-api --lines 20
```

### 6. Проверка работоспособности

```bash
# Получите публичный IP сервера
curl -s ifconfig.me

# Или внутренний IP
hostname -I

# Тест API
curl http://localhost:3000/auth/test  # Должен вернуть JSON
```

## 🌐 Обновление сайта

1. Получите публичный IP сервера
2. Обновите `/website/.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://YOUR_VPS_IP:3000
```

3. Передеплой сайт:
```bash
cd website
npm run build
netlify deploy --prod --dir=.next
```

## 🛠️ Управление сервером

```bash
# Просмотр логов
pm2 logs spark-api

# Перезапуск
pm2 restart spark-api

# Мониторинг
pm2 monit

# Остановка
pm2 stop spark-api

# Удаление
pm2 delete spark-api
```

## 🔒 Безопасность

1. **Измените JWT_SECRET** в production!
2. **Добавьте HTTPS** с Let's Encrypt (certbot)
3. **Ограничьте SSH доступ** только по ключам
4. **Создайте backups** базы данных

## 🔄 Обновление кода

```bash
# Остановите сервер
pm2 stop spark-api

# Загрузите новый код
rsync -avz server-app/ user@your-vps-ip:/opt/spark-server/

# Переустановите зависимости
npm install --production

# Запустите обновленный сервер
pm2 restart spark-api
```

## 🚨 Troubleshooting

### Сервер не запускается
```bash
# Проверьте логи подробнее
pm2 logs spark-api --lines 50

# Проверьте порт
netstat -tlnp | grep :3000
```

### Порт занят
```bash
# Найдите процесс
sudo lsof -i :3000

# Или измените порт в .env на другой свободный
PORT=3001
```

### База данных
```bash
# Расположение БД: /opt/spark-server/spark.db
# Для backup:
cp spark.db spark.db.backup.$(date +%Y%m%d_%H%M%S)
```

## 💰 Рекомендуемые VPS провайдеры

- **DigitalOcean** (droplet $6/месяц)
- **Vultr** (cloud compute $6/месяц)
- **Hetzner** (CX11 $3.48/месяц)
- **Linode** (nanode $5/месяц)

## 🎯 Результат

После развертывания:
- ✅ Регистрация/вход будут работать полностью
- ✅ API доступен 24/7 по постоянному IP
- ✅ Нет проблем с туннелями
- ✅ Высокая стабильность и контроль

**Публичный URL API:** `http://YOUR_VPS_IP:3000`
