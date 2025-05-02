ssh apachadmin@172.30.8.50 'sudo systemctl stop nginx.service'
ssh apachadmin@172.30.8.50 'sudo rm -rf /usr/share/nginx/html/*'
scp -r /usr/share/tomcat/.jenkins/workspace/VCF_UI/build/* apachadmin@172.30.8.50:/usr/share/nginx/html/
ssh apachadmin@172.30.8.50 'sudo chmod -R 777 /usr/share/nginx/html'
ssh apachadmin@172.30.8.50 'sudo systemctl start nginx.service'
