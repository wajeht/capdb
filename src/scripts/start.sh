#!/bin/bash
set -e

if ! command -v pm2 &> /dev/null; then
  echo "Installing PM2..."
  npm install pm2 -g
fi

if pm2 show capdb &> /dev/null; then
  echo "Stopping and deleting existing capdb..."
  pm2 stop capdb
  pm2 delete capdb
fi

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PARENT_DIR="$(dirname "$DIR")"

pm2 start $PARENT_DIR/commands/start.js --name capdb
pm2 startup
pm2 save --force

echo ""
echo "backup scheduler has been started"
echo ""
exit 0
