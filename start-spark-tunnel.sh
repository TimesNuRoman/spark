#!/bin/bash

# 🔥 Spark Public Server Launcher
# Запускает Spark API сервер и Cloudflare Tunnel для публичного доступа
# Работает на любом домашнем ПК без белого IP и без проброса портов

echo "🚀 Spark Public Server Launcher"
echo "==============================="

# Проверяем обязательные условия
command -v node >/dev/null 2>&1 || { echo "❌ Node.js не установлен. Установите Node.js 18+"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm не установлен. Установите npm"; exit 1; }

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функция очистки при выходе
cleanup() {
    echo -e "\n${YELLOW}✊ Останавливаю серверы...${NC}"
    if [ ! -z "$NODE_PID" ]; then
        kill $NODE_PID 2>/dev/null
        echo "✅ Node.js сервер остановлен"
    fi
    if [ ! -z "$TUNNEL_PID" ]; then
        kill $TUNNEL_PID 2>/dev/null
        echo "✅ Tunnel остановлен"
    fi
    echo -e "${GREEN}🎯 Все сервисы остановлены. Спасибо за использование Spark!${NC}"
    exit 0
}

# Перехватываем сигналы для корректного завершения
trap cleanup SIGINT SIGTERM

# Проверяем и устанавливаем cloudflared если нужно
install_cloudflared() {
    echo -e "${BLUE}🔍 Проверяю Cloudflare Tunnel...${NC}"

    if ! command -v cloudflared >/dev/null 2>&1; then
        echo -e "${YELLOW}📥 Скачиваю Cloudflare Tunnel...${NC}"

        if [[ "$(uname -s)" == "Linux" ]]; then
            if [[ "$(uname -m)" == "x86_64" ]]; then
                wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -O cloudflared
            elif [[ "$(uname -m)" == "arm64" ]] || [[ "$(uname -m)" == "aarch64" ]]; then
                wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64 -O cloudflared
            else
                wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-386 -O cloudflared
            fi
        elif [[ "$(uname -s)" == "Darwin" ]]; then
            wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-darwin-amd64.tgz
            tar -xzf cloudflared-darwin-amd64.tgz
            rm cloudflared-darwin-amd64.tgz
        else
            echo -e "${RED}❌ Неподдерживаемая ОС. Cloudflare Tunnel поддерживает Linux и macOS${NC}"
            exit 1
        fi

        chmod +x cloudflared
        sudo mv cloudflared /usr/local/bin/ 2>/dev/null || echo "⚠️  Попробуйте sudo для установки в /usr/local/bin"
        echo -e "${GREEN}✅ Cloudflare Tunnel установлен!${NC}"
    else
        echo -e "${GREEN}✅ Cloudflare Tunnel уже установлен${NC}"
    fi
}

# Запускаем Spark сервер
start_spark_server() {
    echo -e "\n${BLUE}🔥 Запускаю Spark API сервер...${NC}"

    cd server-app

    # Проверим есть ли зависимости
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}📦 Устанавливаю зависимости...${NC}"
        npm install --silent
    fi

    # Запускаем сервер в фоне
    echo -e "${GREEN}⚙️  Запуск сервера на http://localhost:3000...${NC}"
    NODE_ENV=production npm start >/dev/null 2>&1 &
    NODE_PID=$!

    # Ждём запуска сервера
    echo -n "⏳ Жду запуска сервера..."
    for i in {1..30}; do
        if curl -s http://localhost:3000/health >/dev/null 2>&1; then
            echo -e "\n${GREEN}✅ Spark сервер работает! 🔥${NC}"
            curl -s http://localhost:3000/auth/test | head -10
            break
        fi
        echo -n "."
        sleep 1
    done

    if ! curl -s http://localhost:3000/health >/dev/null 2>&1; then
        echo -e "\n${RED}❌ Сервер не запустился. Проверьте логи сервера.${NC}"
        cleanup
        exit 1
    fi
}

# Создаём публичный туннель
create_tunnel() {
    echo -e "\n${BLUE}🌐 Создаю публичный туннель...${NC}"

    # Запускаем туннель
    echo -e "${YELLOW}⏳ Подключаюсь к Cloudflare...${NC}"

    # Запускаем в фоне и читаем вывод
    ./cloudflared tunnel --url http://localhost:3000 2>&1 &
    TUNNEL_PID=$!

    # Ждём создания туннеля
    echo -e "${BLUE}🎯 Ищу публичный URL...${NC}"
    local tunnel_url=""
    local count=0

    while [ $count -lt 30 ]; do
        tunnel_url=$(ps aux | grep "cloudflared.*tunnel.*localhost:3000" | grep -v grep | sed -n 's/.*https:\/\/[^.,]*\.trycloudflare\.com.*/\1/p' 2>/dev/null || echo "")

        if [ ! -z "$tunnel_url" ]; then
            break
        fi

        # Проверяем логи процесса
        tunnel_url=$(curl -s http://localhost:4040/api/tunnels 2>/dev/null | grep -o '"public_url":"[^"]*"' 2>/dev/null || echo "")

        if [ ! -z "$tunnel_url" ]; then
            tunnel_url=$(echo $tunnel_url | cut -d'"' -f4)
            break
        fi

        sleep 1
        count=$((count + 1))
        echo -n "."
    done

    if [ -z "$tunnel_url" ]; then
        echo -e "\n${YELLOW}⚠️  Быстрый туннель создан, но URL не определён автоматически${NC}"
        echo -e "${YELLOW}📝 Проверьте вывод cloudflared выше - там должен быть URL${NC}"
        tunnel_url="ПРОВЕРЬТЕ ВЫВОД CLOUDFLARED ВЫШЕ"
    fi

    cat << 'EOF'

╭────────────────────────────────────────────────────────────────────────────────────────────────────╮
│                                                                                                       │
│   🚀 SPARK PUBLIC SERVER ЗАПУЩЕН! 🔥                                                                  │
│                                                                                                       │
│   🌍 Ваш публичный URL: ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒      │
│                                                                                                       │
│   📱 Можете давать этот URL друзьям - они увидят Spark работающий с вашего ПК!                │
│                                                                                                       │
│   🔐 Безопасность: Ваш ПК не открывает порты - трафик через зашифрованный туннель             │
│                                                                                                       │
│   ⏹️  Для остановки: нажмите Ctrl+C                                                         │
│                                                                                                       │
╰────────────────────────────────────────────────────────────────────────────────────────────────────╯

EOF

    if [ "$tunnel_url" != "ПРОВЕРЬТЕ ВЫВОД CLOUDFLARED ВЫШЕ" ]; then
        echo "   🌍 Ваш публичный URL: $tunnel_url"
    fi

    echo ""

    # Ждём завершения (Ctrl+C)
    wait $TUNNEL_PID
}

# Ожидаем завершения (Ctrl+C или ошибка)
wait_processes() {
    echo -e "\n${BLUE}🎮 Сервер Spark работает. Нажмите Ctrl+C для завершения${NC}"

    # Ждём завершения любого процесса
    wait
}

# Основная функция
main() {
    install_cloudflared
    start_spark_server
    create_tunnel
    wait_processes
}

# Запускаем
main
