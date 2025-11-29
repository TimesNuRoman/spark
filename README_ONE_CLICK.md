# 🚀 SPARK ONE-CLICK AUTOMATIC LAUNCH

## ⚡ ЗАПУСК В 1 КЛИК

### **Просто дважды кликни на:**
`start_spark.bat`

**ЭТО ВСЁ!** Автоматический запуск всей экосистемы Spark

---

## 🔄 ЧТО ПРОИСХОДИТ АВТОМАТИЧЕСКИ:

1. **✅ Backend Server** (Express + SQLite)
   - Порт: 8000
   - Авто-запуск с зависимостями

2. **✅ Cloudflare Tunnel** (глобальный доступ)
   - Авто-создание туннеля
   - HTTPS шифрование
   - Динамический URL

3. **✅ Frontend Build**
   - Production версия
   - Next.js + TypeScript
   - Tailwindデザイン

4. **✅ Environment Config**
   - Авто-настройка NEXT_PUBLIC_API_URL
   - Локальная разработка
   - Production deployment

5. **✅ GitHub Deployment**
   - Авто-коммит
   - Push to production
   - Netlify автоматический build

---

## 🌍 РЕЗУЛЬТАТ:

### **СПАРК ЗАПУЩЕН ГЛОБАЛЬНО!**

```
🌟 RUNNING SYSTEMS:
✅ Backend: http://localhost:8000
✅ Tunnel: https://[auto-generated].trycloudflare.com
✅ Frontend (Prod): http://localhost:3000
✅ Frontend (Dev): http://localhost:3001
✅ GitHub: Deployed
✅ Netlify: Building...

🌍 PUBLIC ACCESS:
🔗 Website: https://spark-production.netlify.app
🔗 API: https://[tunnel-url].trycloudflare.com

🎯 FEATURES:
• AI-powered feed algorithm
• End-to-end encrypted messaging
• AI comment moderation (Rule 43)
• Mobile responsive design
• Global access from any device
```

---

## 🛠️ РУЧНОЙ КОНТРОЛЬ:

### **Параметры запуска:**

```powershell
# Только backend и tunnel
.\start_spark_automatic.ps1

# С development frontend
.\start_spark_automatic.ps1 -Development

# С production frontend
.\start_spark_automatic.ps1 -Production

# Всё включено
.\start_spark_automatic.ps1 -All
```

### **Остановка сервисов:**

```powershell
# Проверить jobs
Get-Job

# Остановить все processes
Get-Job | Stop-Job -PassThru | Remove-Job

# Или просто закрой окно PowerShell
```

---

## 📊 МОНИТОРИНГ:

### **Файлы логирования:**
- `spark_launch.log` - детальные логи запуска

### **Проверка здоровья:**
```bash
# Health check API
curl localhost:8000/health

# Public API test
curl https://[tunnel-url]/health
```

### **Process monitoring:**
```powershell
# Active jobs
Get-Job

# Network ports
netstat -ano | findstr ":8000"
netstat -ano | findstr ":3000"
netstat -ano | findstr ":3001"
```

---

## 🔧 ТРОУБЛШУТИНГ:

### **Если не запускается:**
1. Проверь права администратора
2. Убедись что порты свободны (закрой другие приложения)
3. Проверь `spark_launch.log` файла

### **Если tunnel не работает:**
```powershell
# Kill старые processes
taskkill /F /IM cloudflared.exe /T

# Перезапуск tunnel
.\cloudflared tunnel --url http://localhost:8000
```

### **Если frontend не загружается:**
```powershell
# В папке website:
npm install
npm run build
npm run start
```

---

## 💡 TIPS:

• **Сохраняй PowerShell окно открытым** для поддержки tunnel
• **Используй `start_spark.bat`** для простого запуска
• **Логи доступны в `spark_launch.log`**
• **При проблемах смотри `SPARK_AI_LAUNCH_INSTRUCTIONS.md`**

---

## 🎊 ОКОНЧАТЕЛЬНЫЙ СТАТУС: СПАРК ГОТОВ!

**🌍 SPARK ЖИВЕТ ГЛОБАЛЬНО! ТЕПЕРЬ ТВОЙ ДОМАШНИЙ ПК - ЭТО ГЛОБАЛЬНАЯ СОЦИАЛЬНАЯ СЕТЬ!** ⚡🚀

---
