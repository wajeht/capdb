#!/bin/bash

if ! command -v pm2 &> /dev/null; then
  echo "Installing PM2..."
  npm install pm2 -g
fi

if pm2 show backup-script &> /dev/null; then
  echo "Stopping and deleting existing backup-script..."
  pm2 stop backup-script
  pm2 delete backup-script
fi

npm install

pm2 start ./src/commands/start.js --name backup-script

echo "Backup script started using PM2."

pm2 list

echo ""
echo "backup scheduler has been started"
