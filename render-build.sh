#!/usr/bin/env bash
# This script installs Chromium and moves it to Puppeteer's expected location

echo "🔧 Installing Chromium manually..."
apt-get update
apt-get install -y wget unzip
wget https://storage.googleapis.com/chromium-browser-snapshots/Linux_x64/1144311/chrome-linux.zip
unzip chrome-linux.zip
mkdir -p /opt/render/.cache/puppeteer
mv chrome-linux /opt/render/.cache/puppeteer/chrome
