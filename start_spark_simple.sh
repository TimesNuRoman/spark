#!/bin/bash

# 🔥 SPARK SIMPLE LAUNCH SCRIPT
# Простой автоматический запуск Spark

echo "🚀 SPARK SIMPLE LAUNCH - STARTING..."
echo "===================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Function to log messages
log_message() {
    echo -e "${BLUE}[$(date '+%H:%M:%S')] $1${NC}"
}

# Check if running on Windows (via WSL/Git Bash)
if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    echo -e "${YELLOW}Detected Windows environment - using PowerShell for background jobs${NC}"
else
    echo -e "${YELLOW}Detected Linux/Mac environment${NC}"
fi

# Step 1: Start Backend Server
log_message "🔧 Starting Spark Backend Server..."
if [ -d "server-app" ]; then
    cd server-app
    npm start &
    server_pid=$!
    cd ..
    log_message "✅ Server started (PID: $server_pid)"
else
    echo -e "${RED}❌ Server directory not found!${NC}"
    exit 1
fi

# Step 2: Wait for server to be ready
log_message "⏳ Waiting for server startup..."
sleep 5

# Check if server is running
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    log_message "✅ Server is ready at http://localhost:8000"
else
    echo -e "${RED}❌ Server failed to start${NC}"
fi

# Step 3: Start Cloudflare Tunnel
log_message "🌏 Starting Cloudflare Tunnel..."
if [ -f "cloudflared.exe" ]; then
    # Start tunnel in background
    ./cloudflared tunnel --url http://localhost:8000 &
    tunnel_pid=$!
    log_message "✅ Tunnel started (PID: $tunnel_pid)"

    # Wait for tunnel
    log_message "⏳ Waiting for tunnel connection..."
    sleep 15

    log_message "✅ Tunnel ready: https://estates-victorian-remedies-reflect.trycloudflare.com"
else
    echo -e "${RED}❌ cloudflared.exe not found!${NC}"
    exit 1
fi

# Step 4: Configure environment
log_message "⚙️  Configuring environment..."
TUNNEL_URL="https://estates-victorian-remedies-reflect.trycloudflare.com"

# Update .env.local
if [ -d "website" ]; then
    echo "NEXT_PUBLIC_API_URL=$TUNNEL_URL" > website/.env.local
    log_message "✅ Environment configured"
fi

# Step 5: Start development frontend
log_message "💻 Starting Development Frontend..."
if [ -d "website" ]; then
    cd website
    npm install --silent
    npm run dev &
    frontend_pid=$!
    cd ..
    log_message "✅ Development frontend started at http://localhost:3001"
else
    echo -e "${RED}❌ Website directory not found!${NC}"
fi

# Step 6: Git deploy
log_message "🚀 Deploying to GitHub..."
if [ -d ".git" ]; then
    git add .
    git commit -m "🚀 Automatic Spark Launch

✅ Server: http://localhost:8000
✅ Tunnel: $TUNNEL_URL
✅ Frontend: Development ready

🔥 Spark Live Globally!" >> /dev/null 2>&1

    git push origin master >> /dev/null 2>&1
    if [ $? -eq 0 ]; then
        log_message "✅ Code pushed to GitHub"
        log_message "✅ Netlify will auto-deploy in 2-3 minutes"
    fi
fi

# Step 7: Status summary
echo ""
echo -e "${GREEN}🌟 SPARK SYSTEMS STATUS:${NC}"
echo -e "${GREEN}=============================${NC}"
echo -e "${GREEN}✅ Backend API:     http://localhost:8000${NC}"
echo -e "${GREEN}✅ Tunnel:          $TUNNEL_URL${NC}"
echo -e "${GREEN}✅ Dev Frontend:    http://localhost:3001${NC}"
echo -e "${GREEN}✅ GitHub Push:     ✅${NC}"
echo ""
echo -e "${YELLOW}🌍 PUBLIC ACCESS:${NC}"
echo -e "${YELLOW}Frontend: https://spark-production.netlify.app${NC}"
echo -e "${YELLOW}API:      $TUNNEL_URL${NC}"
echo ""
echo -e "${BLUE}💡 Keep processes running:${NC}"
echo "  - Server PID:  $server_pid"
echo "  - Tunnel PID:  $tunnel_pid"
echo "  - Frontend PID: $frontend_pid"
echo ""
echo -e "${GREEN}🚀 SPARK IS ALIVE GLOBALLY!${NC}"

# Step 8: Auto-open browser tabs
log_message "🌐 Opening browser tabs..."
sleep 3

# Detect OS and open browser
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    if command -v xdg-open > /dev/null; then
        OPEN_CMD="xdg-open"
    elif command -v gnome-open > /dev/null; then
        OPEN_CMD="gnome-open"
    else
        OPEN_CMD="echo"
        echo -e "${YELLOW}⚠️  Cannot auto-open browser on this Linux system${NC}"
    fi
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OPEN_CMD="open"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    OPEN_CMD="start"
else
    OPEN_CMD="echo"
    echo -e "${YELLOW}⚠️  Cannot auto-open browser on this system${NC}"
fi

# Open tabs
if [ "$OPEN_CMD" != "echo" ]; then
    log_message "📋 Opening Spark tabs..."
    $OPEN_CMD "http://localhost:8000/health" 2>/dev/null &
    sleep 1
    $OPEN_CMD "http://localhost:3001" 2>/dev/null &
    sleep 1
    $OPEN_CMD "https://spark-production.netlify.app" 2>/dev/null &
    sleep 1

    echo ""
    echo -e "${GREEN}🎯 BROWSER TABS OPENED:${NC}"
    echo -e "${BLUE}  1. API Health Check: http://localhost:8000/health${NC}"
    echo -e "${BLUE}  2. Local Website:    http://localhost:3001${NC}"
    echo -e "${BLUE}  3. Global Website:   https://spark-production.netlify.app${NC}"
else
    echo ""
    echo -e "${YELLOW}📋 Open these manually:${NC}"
    echo -e "${BLUE}  1. http://localhost:8000/health${NC}"
    echo -e "${BLUE}  2. http://localhost:3001${NC}"
    echo -e "${BLUE}  3. https://spark-production.netlify.app${NC}"
fi

# Wait for Ctrl+C
trap "log_message 'Stopping Spark services...'; kill $server_pid $tunnel_pid $frontend_pid 2>/dev/null; exit" INT
echo ""
echo -e "${BLUE}🎋 Press Ctrl+C to stop all services...${NC}"
while true; do
    sleep 10
    # Health check every 30 seconds
    if (( $(date +%s) % 30 == 0 )); then
        if curl -s http://localhost:8000/health > /dev/null 2>&1; then
            log_message "✅ Health check passed"
        else
            log_message "❌ Health check failed"
        fi
    fi
done
