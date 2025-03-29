#!/bin/bash

# تثبيت Certbot
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-nginx

# الحصول على شهادة SSL
sudo certbot --nginx \
  --non-interactive \
  --agree-tos \
  --email admin@drbassma.com \
  --domains drbassma.com,www.drbassma.com \
  --redirect

# إضافة تجديد تلقائي للشهادات
echo "0 0,12 * * * root python -c 'import random; import time; time.sleep(random.random() * 3600)' && certbot renew -q" | sudo tee -a /etc/crontab > /dev/null

# تكوين Nginx
sudo cp nginx.conf /etc/nginx/sites-available/drbassma
sudo ln -s /etc/nginx/sites-available/drbassma /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

echo "تم إعداد SSL بنجاح!" 