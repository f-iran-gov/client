#!/bin/bash

cd /var/www/client/
echo -ne "17\n"
sudo git pull origin master
echo -ne "33\n"
sudo npm i
echo -ne "50\n"
sudo npm run build
echo -ne "67\n"
sudo pm2 delete all 
echo -ne "75\n"
sudo pm2 start npm --name client -- start
echo -ne "83\n"
sudo systemctl restart nginx
echo -ne "100\n"
