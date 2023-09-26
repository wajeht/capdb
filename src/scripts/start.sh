#!/bin/bash

# Check if PM2 is installed, and install if not
if ! command -v pm2 &> /dev/null; then
  echo "Installing PM2..."
  npm install pm2 -g
fi

# Stop and delete existing backup-script if it's running
if pm2 show backup-script &> /dev/null; then
  echo "Stopping and deleting existing backup-script..."
  pm2 stop backup-script
  pm2 delete backup-script
fi

# Install dependencies
npm install

# build
npm run build

# Start your TypeScript script using PM2
pm2 start ./dist/src/commands/start.js --name backup-script

# Display a message indicating successful start
echo "Backup script started using PM2."

# Display a list of running PM2 processes
pm2 list
