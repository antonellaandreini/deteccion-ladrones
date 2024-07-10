#!/bin/bash

set -e

if [[ `id -u` -ne 0 ]] ; then echo "Correr con sudo" ; exit 1 ; fi

apt install -y nodejs npm libopencv-dev libvips

wget -q https://www.postgresql.org/media/keys/ACCC4CF8.asc -O - | apt-key add -
sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" >> /etc/apt/sources.list.d/pgdg.list'
apt-get install postgresql postgresql-contrib

npm install -g bower
npm install -g localtunnel

npm install
bower install --allow-root
