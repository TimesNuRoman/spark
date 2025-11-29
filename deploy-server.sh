#!/bin/bash

# Spark Server VPS Deployment Script
# Usage: ./deploy-server.sh [user@host]

echo "🚀 Spark API Server Deployment Script"

if [ $# -eq 0 ]; then
    echo "Usage: $0 user@hostname (example: root@your-vps.com)"
    exit 1
fi

SERVER=$1

echo "📋 Deployment checklist:"
echo "1. VPS server accessible via SSH"
echo "2. Server specs: Ubuntu/CentOS/RHEL, 512MB+ RAM, 1GB+ storage"
echo "3. Your SSH key added to authorized_keys"

read -p "Continue with deployment to $SERVER? (y/N) " -n 1 -r
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

echo -e "\n\n🔧 Updating system and installing Node.js..."
ssh $SERVER << 'EOF'
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18 LTS (latest stable)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version

# Install PM2 for process management
sudo npm install -g pm2

# Create app directory
sudo mkdir -p /opt/spark-server
sudo chown $USER:$USER /opt/spark-server
EOF

echo "📦 Uploading server files..."
rsync -avz --exclude='node_modules' --exclude='.git' server-app/ $SERVER:/opt/spark-server/

echo "🔨 Installing dependencies..."
ssh $SERVER << 'EOF'
cd /opt/spark-server

# Install dependencies
npm install --production

# Install SQLite3 C++ dependencies (if needed)
sudo apt-get install -y build-essential libsqlite3-dev
EOF

echo "🗃️ Setting up database..."
ssh $SERVER << 'EOF'
cd /opt/spark-server

# Database will be auto-created on first run
# Backup existing if exists
if [ -f "spark.db" ]; then
    cp spark.db spark.db.backup
fi
EOF

echo "🔐 Setting up production environment..."
ssh $SERVER << 'EOF'
cd /opt/spark-server

# Create production config
cat > .env << 'EOL'
NODE_ENV=production
PORT=3000
JWT_SECRET=spark_production_secret_2025_secure_key_change_this_in_production
EOF

# Set proper permissions
chmod 600 .env
EOF

echo "⚙️ Configuring firewall and PM2..."
ssh $SERVER << 'EOF'
# Open port 3000 (or your port)
sudo ufw allow 3000
sudo ufw --force enable

# Configure PM2 startup
cd /opt/spark-server
pm2 start index.js --name "spark-api"
pm2 save
pm2 startup

# Show status
pm2 status
pm2 logs --lines 20
EOF

echo "🌐 Getting server IP for API URL..."
SERVER_IP=$(ssh $SERVER "curl -s ifconfig.me || hostname -I | awk '{print \$1}'")

echo ""
echo "🎉 Deployment completed!"
echo "📡 Server running on: http://$SERVER_IP:3000"
echo ""
echo "🔄 Update your website .env.local with:"
echo "NEXT_PUBLIC_API_URL=http://$SERVER_IP:3000"
echo ""
echo "🛠️  Management commands:"
echo "SSH into server: ssh $SERVER"
echo "View logs:        pm2 logs spark-api"
echo "Restart server:   pm2 restart spark-api"
echo "Monitor:          pm2 monit"
echo ""
echo "🔒 Security: Remember to change JWT_SECRET in production!"
echo "🔥 Backup: Database file: /opt/spark-server/spark.db"
