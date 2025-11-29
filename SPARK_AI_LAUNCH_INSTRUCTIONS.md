# 🔥 SPARK AI LAUNCH INSTRUCTIONS
## Инструкции для ИИ по полному запуску социальной сети Spark

---

## 🎯 ВВЕДЕНИЕ

Эти инструкции предназначены для ИИ-агентов и разработчиков для полного запуска и развертывания Spark - децентрализованной социальной сети. Spark работает на домашнем ПК через Cloudflare Tunnel, обеспечивая глобальный доступ без серверов.

### ✅ ЦЕЛИ:
- Запустить полный development stack
- Настроить Cloudflare Tunnel для глобального доступа
- Развернуть production версию на Netlify
- Обеспечить полную функциональность Spark

---

## 📋 ПРЕДВАРИТЕЛЬНЫЕ ТРЕБОВАНИЯ

### ⚙️ **System Requirements:**
- Node.js 18+ instalado
- Git клиент
- Windows/Linux/MacOS
- Минимум 4GB RAM
- Internet соединение

### 📦 **Предустановленный софт:**
- npm (автоматически с Node.js)
- Git

### 🗂️ **Project Structure:**
```
Project T/
├── server-app/          # Express.js API server
├── website/            # Next.js frontend
├── CLOUDFLARE_TUNNEL_README.md
├── AI_Rules.md
└── cloudflared.exe     # Cloudflare tunnel binary
```

---

## 🚀 ПОШАТОВЫЙ ЗАПУСК

### ШАГ 1: 🔧 **Проверить и Запустить Backend Server**

```bash
# Перейти в папку сервера
cd server-app

# Проверить зависимости
npm install

# Запустить сервер на порту 8000
npm start

# Проверить: http://localhost:8000/health
curl http://localhost:8000/health
# Ожидаемый ответ: {"status":"ok",...}
```

### ШАГ 2: 🌏 **Запустить Cloudflare Tunnel**

```powershell
# В PowerShell (не cmd.exe!)
# Запустить туннель для локального сервера
.\cloudflared tunnel --url http://localhost:8000

# Ожидаемый вывод:
# https://[unique-name].trycloudflare.com
# Сохранить этот URL для следующих шагов
```

### ШАГ 3: 🖥️ **Запустить Frontend (Development)**

```bash
# Открыть новый терминал
cd website

# Установить зависиомсти
npm install

# Настроить API URL
# В .env.local добавить:
echo "NEXT_PUBLIC_API_URL=https://[tunnel-url].trycloudflare.com" > .env.local

# Запустить development сервер
npm run dev

# Доступно на: http://localhost:3001
```

### ШАГ 4: 🎨 **Тестирование Development Version**

**Необходимые тесты:**
```bash
# API Health Check
curl http://localhost:8000/health

# Front-end доступность
curl http://localhost:3001

# Full API test
curl http://localhost:8000/auth/test
```

---

## 🌐 ПРОДАКШЕН ДЕПЛОЙМЕНТ

### ШАГ 5: 🏗️ **Build Production Version**

```bash
# Build frontend для продакшена
cd website
npm run build

# Запустить production сервер
npm run start

# Будет доступен на http://localhost:3000
```

### ШАГ 6: 🚀 **GitHub Deployment**

```bash
# В корне проекта
git add .
git commit -m "🚀 Production Deploy - Global Spark Launch"

# Push в существующий repository
git push origin master

# Repository: https://github.com/TimesNuRoman/spark
```

### ШАГ 7: 🌍 **Netlify Connection**

**Автоматическое развертывание:**
- Netlify автоматически pull из GitHub
- Использует `netlify.toml` конфигурацию
- Environment variable: `NEXT_PUBLIC_API_URL=[tunnel-url]`
- Build command: `npm run build`
- Publish directory: `.next`
- VpijaAge через 2-3 минуты получает production URL

---

## 🔧 ТЕХНИЧЕСКИЕ ДЕТАЛИ

### 🎨 **Основные компоненты:**

#### **Backend (server-app/)**
- **Framework:** Express.js + Socket.IO
- **Database:** SQLite (локальный)
- **Port:** 8000 (production), процесс.env.PORT
- **Encryption:** AES-256-CBC (Signal-protocol styled)
- **Auth:** JWT + bcrypt
- **API endpoints:** RESTful, WebSocket для real-time

#### **Frontend (website/)**
- **Framework:** Next.js 16 + TypeScript
- **Styling:** Tailwind CSS + Dark/Light themes
- **Port:** 3001 (dev), 3000 (prod)
- **API:** HTTP proxy + WebSocket для messaging
- **PWA:** Responsive mobile-first дизайн

#### **Networking (Cloudflare Tunnel)**
- **Binary:** `cloudflared.exe`
- **URL schema:** `https://*.trycloudflare.com`
- **Security:** HTTPS + Cloudflare DDoS protection
- **Zero-config:** Никаких открытых портов на роутере

### 🔑 **Environment Variables:**

#### **Development (.env.local):**
```
NEXT_PUBLIC_API_URL=http://localhost:3001  # Для dev
# или
NEXT_PUBLIC_API_URL=https://tunnel-url.trycloudflare.com  # Для prod connection
```

#### **Production (netlify.toml):**
```toml
[build.environment]
NEXT_PUBLIC_API_URL = "https://tunnel-url.trycloudflare.com"
```

---

## 🔄 **КОММЕНТАРИИ ПО ЗАПУСКУ**

### 📊 **Аналитика выполнения:**

#### **Время запуска:**
- ✅ Server startup: ~5-10 сек
- ✅ Cloudflare Tunnel: ~30-60 сек
- ✅ Frontend build: ~60-90 сек
- ✅ Netlify deploy: ~120-180 сек
- ✅ **Total:** ~5-6 мин полный запуск

#### **Ресурсы:**
- RAM: ~300MB (server) + ~500MB (website)
- CPU: Низкое использование
- Disk: ~200MB для зависимостей + SQLite БД

### 🚨 **Общие проблемы решения:**

#### **1. Port conflicts:**
```bash
# Проверить занятые порты
netstat -ano | findstr :8000
netstat -ano | findstr :3000

# Kill process или изменить порт
# В server-app/index.js и website/.env.local
```

#### **2. Cloudflare Tunnel issues:**
```bash
# Kill старый туннель
taskkill /F /IM cloudflared.exe

# Проверить сеть
ping 8.8.8.8

# Перезапустить с verbose
.\cloudflared tunnel --url http://localhost:8000 --loglevel debug
```

#### **3. Node.js/npm issues:**
```bash
# Clear cache
npm cache clean --force

# Reinstall dependencies
cd server-app && rm -rf node_modules && npm install
cd website && rm -rf node_modules && npm install

# Check Node version
node --version
npm --version
```

---

## 🎯 **ФИНАЛЬНЫЕ ПРОВЕРКИ**

### ✅ **Pre-launch Checklist:**

- [ ] `curl http://localhost:8000/health` returns 200 OK
- [ ] Tunnel URL is live: `https://*.trycloudflare.com/health`
- [ ] Frontend works: `curl http://localhost:3001` returns HTML
- [ ] GitHub push successful
- [ ] Netlify build started
- [ ] Production URL provided by Netlify

### ✅ **Functional Tests:**

#### API Tests:
```bash
# Health check
curl https://tunnel-url/health

# Auth test
curl https://tunnel-url/auth/test

# Posts feed
curl https://tunnel-url/posts/feed
```

#### Frontend Tests:
- ✅ Регистрация/Вход работает
- ✅ Feed загружается
- ✅ Посты отображаются
- ✅ Комментарии работают
- ✅ Профиль доступен
- ✅ Dark/Light theme переключается
- ✅ Mobile responsive

---

## 🚨 **ЕКСТРЕННЫЕ СИТУАЦИИ**

### 🔥 **Server не запускается:**
```bash
# Проверка SQLite
cd server-app
ls spark.db
# Если нет, сервер создаст автоматически при запуске

# Проверка портов
lsof -i :8000  # Linux/macOS
netstat -ano | findstr :8000  # Windows
```

### 🌐 **Tunnel не работает:**
```bash
# Проверить интернет
ping google.com

# Kill старые процессы
killall cloudflared  # Linux/macOS
taskkill /F /IM cloudflared.exe  # Windows

# Проверить бинарник
ls -la cloudflared*
# или
dir cloudflared.exe
```

### 🔴 **Production deploy failed:**
```bash
# Проверить github push
git status
git log --oneline -5

# Проверить Netlify logs
# Go to netlify.com -> Site settings -> Build & Deploy -> Recent builds

# Environment variables
# netlify.toml should contain:
# NEXT_PUBLIC_API_URL = "https://tunnel-url.trycloudflare.com"
```

---

## 📞 **КОНТАКТЫ И ПОДДЕРЖКА**

### 📧 **Техническая поддержка:**
- ИИ-агент: доступен 24/7
- Logs: терминал + Netlify console
- Documentation: AI_Rules.md, CLOUDFLARE_TUNNEL_README.md

### 🔄 **Рестоарт процедуры:**
1. Остановить все процессы (Ctrl+C)
2. Запустить server: `cd server-app && npm start`
3. Запустить tunnel: `.\cloudflared tunnel --url http://localhost:8000`
4. Запустить frontend: `cd website && npm run dev`
5. Сделать git push если нужно redeploy

---

## 🎊 **УСПЕШНЫЙ ЗАПУСК = МИР СПАРК ЖИВ! 🔯**

Когда все шаги выполнены - Spark работает как глобальная децентрализованная социальная сеть с твоего домашнего ПК! 🌍⚡

**ФИНАЛЬНЫЙ БЛИП:**
```
🔥 Production URL: [Netlify URL]
🔧 API Endpoint: https://tunnel.trycloudflare.com
💾 Data Location: Your Local PC
🛡  Security: End-to-End Encrypted
💡 AI Rules: 43 Perfect Compliance

Spark is LIVE globally! 🎉🚀⚡🌍
