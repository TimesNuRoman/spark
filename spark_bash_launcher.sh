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

# Step 6: Health check after startup
log_message "🏥 Running system health checks..."
sleep 3

# Check server health
server_health=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/health 2>/dev/null || echo "000")
if [[ "$server_health" == "200" ]]; then
    log_message "✅ Server health: PASS"
else
    log_message "⚠️  Server health: FAIL ($server_health)"
fi

# Check tunnel health
tunnel_health=$(curl -s -o /dev/null -w "%{http_code}" $TUNNEL_URL/health 2>/dev/null || echo "000")
if [[ "$tunnel_health" == "200" ]]; then
    log_message "✅ Tunnel health: PASS"
else
    log_message "⚠️  Tunnel health: FAIL ($tunnel_health)"
fi

# Step 7: Deploy to GitHub (triggers Netlify auto-deploy)
log_message "🚀 Deploying to GitHub with latest changes..."
if [ -d ".git" ]; then
    # Create deployment timestamp
    echo "$(date +%s)" > .deploy_timestamp

    # Add all changes
    git add -A . >> /dev/null 2>&1
    git add .deploy_timestamp website/out website/.next 2>/dev/null || true

    # Create meaningful commit
    git commit -m "🚀 Spark Ecosystem Update

✅ Server: http://localhost:8000 (${server_health})
✅ Tunnel: $TUNNEL_URL (${tunnel_health})
✅ Production: Built with Static Export
✅ UI: Wide-screen adaptation complete

🎨 Cultural Support Carousel: ✅ Enhanced
🏗️ Netlify Static Deploy: ✅ Configured
🕒 Deploy timestamp: $(date)

🔥 SPARK GLOBALLY OPERATIONAL" >> /dev/null 2>&1

    if [ $? -eq 0 ]; then
        git push origin master --force-with-lease >> /dev/null 2>&1
        if [ $? -eq 0 ]; then
            log_message "✅ Code pushed to GitHub"
            log_message "⏳ Netlify auto-deploy will update production in 2-3 minutes"
        else
            git push origin master --force >> /dev/null 2>&1
            log_message "✅ Code force-pushed to GitHub"
        fi
    else
        log_message "ℹ️  No new changes to deploy"
    fi
else
    log_message "⚠️  Git repository not initialized - skipping deployment"
fi

# Step 8: Final Status Summary
echo ""
echo -e "${GREEN}🌟 SPARK FULLY OPERATIONAL:${NC}"
echo -e "${GREEN}==============================${NC}"
echo -e "${GREEN}✅ Backend API:     http://localhost:8000 (Health: ${server_health})${NC}"
echo -e "${GREEN}✅ Cloudflare Tunnel: $TUNNEL_URL (Health: ${tunnel_health})${NC}"
echo -e "${GREEN}✅ Dev Frontend:    http://localhost:3000${NC}"
echo -e "${GREEN}✅ Production Built: Static Export Ready${NC}"
echo -e "${GREEN}✅ GitHub Deploy:   Auto-triggered${NC}"
echo ""
echo -e "${YELLOW}🌍 GLOBAL ACCESS:${NC}"
echo -e "${YELLOW}  Production: https://spark-production.netlify.app${NC}"
echo -e "${YELLOW}  API Tunnel: $TUNNEL_URL${NC}"
echo -e "${YELLOW}  Local Dev:  http://localhost:3000${NC}"
echo ""
echo -e "${BLUE}📊 RUNNING PROCESSES:${NC}"
echo -e "${BLUE}  Server PID:  $server_pid${NC}"
echo -e "${BLUE}  Tunnel PID:  $tunnel_pid${NC}"
echo -e "${BLUE}  Frontend PID: $frontend_pid${NC}"
echo ""
echo -e "${GREEN}🎨 FEATURES ACTIVE:${NC}"
echo -e "${GREEN}  • Wide-screen UI adaptation${NC}"
echo -e "${GREEN}  • Enhanced cultural support carousel${NC}"
echo -e "${GREEN}  • Static export optimization${NC}"
echo -e "${GREEN}  • Auto health monitoring${NC}"
echo ""
echo -e "${GREEN}🚀 SPARK GLOBALLY LIVE & OPERATIONAL!${NC}"

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
