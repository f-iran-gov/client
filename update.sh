#!/bin/bash

cd /var/www/client/
echo -ne "17\n"
git pull origin master
echo -ne "33\n"
npm i
echo -ne "50\n"
npm run build
echo -ne "67\n"
pm2 delete all && pm2 start npm --name client -- start
echo -ne "83\n"
systemctl restart nginx
echo -ne "100\n"
