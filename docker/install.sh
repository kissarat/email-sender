#!/bin/bash
# Script will exit when error occurs in any of following commands
set -e

ln -sf /usr/share/zoneinfo/Europe/Kiev /etc/localtime
apt update
#dpkg-reconfigure locales
echo -e 'LANG=en_US\nLANGUAGE=en\nLC_ALL=en_US.UTF-8\nLC_COLLATE=ru_RU.UTF-8' >> /etc/environment
apt upgrade -y
apt install -y curl git gnupg2 vim
curl -sL https://deb.nodesource.com/setup_14.x -o nodesource_setup.sh
bash nodesource_setup.sh
apt install -y nodejs build-essential
cd /server
npm i -g gulp pm2 node-gyp
export NODE_ENV=development
export PORT=3000
export HOST=0.0.0.0
npm i
#npm run migrate
