#!/bin/bash
# Script will exit when error occurs in any of following commands
set -e

ln -sf /usr/share/zoneinfo/Europe/Kiev /etc/localtime
apt-get update
#dpkg-reconfigure locales
echo -e 'LANG=en_US\nLANGUAGE=en\nLC_ALL=en_US.UTF-8\nLC_COLLATE=ru_RU.UTF-8' >> /etc/environment
apt-get upgrade -y
apt-get install -y curl
curl -sL https://deb.nodesource.com/setup_14.x -o nodesource_setup.sh
bash nodesource_setup.sh
apt-get install -y nodejs
npm i -g pm2
# cd /server
# npm i
