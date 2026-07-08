#!/bin/bash
# deploy_gce.sh - Setup script for pocketsmart backend on Ubuntu GCE VM

set -e

echo "=== PocketSmart GCE VM Auto-Deploy Script ==="

# 1. Update system packages
echo "Updating packages..."
sudo apt update && sudo apt upgrade -y

# 2. Install Python, MySQL, Git, and Nginx
echo "Installing Python, MySQL, Git, and Nginx..."
sudo apt install -y python3-pip python3-venv git mysql-server nginx

# 3. Secure and setup MySQL Database
echo "Configuring MySQL Database..."
sudo systemctl start mysql
sudo systemctl enable mysql

# Create database and user
sudo mysql -e "CREATE DATABASE IF NOT EXISTS pocketsmart;"
sudo mysql -e "CREATE USER IF NOT EXISTS 'root'@'localhost' IDENTIFIED BY 'Home@2024';"
sudo mysql -e "GRANT ALL PRIVILEGES ON pocketsmart.* TO 'root'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"

# 4. Set up virtual environment and dependencies
echo "Setting up Python virtual environment..."
mkdir -p ~/app
# Copy current directory files to app directory
cp -r . ~/app
cd ~/app

python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install flask mysql-connector-python gunicorn

# 5. Initialize database tables
echo "Initializing MySQL database schema..."
python3 init_db.py

# 6. Create systemd Service file
echo "Creating systemd service configuration..."
sudo bash -c 'cat > /etc/systemd/system/pocketsmart.service <<EOF
[Unit]
Description=Gunicorn instance to serve pocketsmart backend
After=network.target mysql.service

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/app
Environment="PATH=/home/ubuntu/app/venv/bin"
ExecStart=/home/ubuntu/app/venv/bin/gunicorn --workers 3 --bind 127.0.0.1:5000 main:app
Restart=always

[Install]
WantedBy=multi-user.target
EOF'

# 7. Start and Enable pocketsmart service
echo "Starting pocketsmart service..."
sudo systemctl daemon-reload
sudo systemctl start pocketsmart
sudo systemctl enable pocketsmart

# 8. Configure Nginx Reverse Proxy
echo "Configuring Nginx reverse proxy..."
sudo bash -c 'cat > /etc/nginx/sites-available/default <<EOF
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }
}
EOF'

echo "Restarting Nginx..."
sudo systemctl restart nginx

echo "=== Deployment Complete ==="
echo "The backend is now running persistently behind Nginx on port 80!"
echo "Access it via http://<YOUR_VM_EXTERNAL_IP>"
