ssh apachadmin@172.30.1.85 'sudo systemctl stop nginx.service'
ssh apachadmin@172.30.1.85 'sudo rm -rf /usr/share/nginx/html/*'
scp -r /usr/share/tomcat/.jenkins/workspace/VCF_UI/build/* apachadmin@172.30.1.85:/usr/share/nginx/html/
ssh apachadmin@172.30.1.85 'sudo chmod -R 777 /usr/share/nginx/html'
ssh apachadmin@172.30.1.85 'sudo systemctl start nginx.service'
