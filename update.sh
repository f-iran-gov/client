#!/bin/bash

sudo echo -ne "\n" >> /var/log/client-update.log
sudo date >> /var/log/client-update.log
sudo echo -ne "------------------------------------------------------------------\n" >> /var/log/client-update.log

cd /var/www/client/
sudo git pull origin master >> /var/log/client-update.log 2>&1
sudo npm i >> /var/log/client-update.log 2>&1
sudo npm run build >> /var/log/client-update.log 2>&1
sudo pm2 delete all  >> /var/log/client-update.log 2>&1
sudo pm2 start npm --name client -- start >> /var/log/client-update.log 2>&1
sudo systemctl restart nginx >> /var/log/client-update.log 2>&1
