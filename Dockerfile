FROM nginx:latest
COPY nginx-repo.crt /etc/ssl/nginx/
COPY nginx-repo.key /etc/ssl/nginx/
RUN apt-get update && apt-get install -y curl gnupg2 ca-certificates lsb-release wget debian-archive-keyring
RUN echo "deb https://plus-pkgs.nginx.com/debian `lsb_release -cs` nginx-plus" | tee /etc/apt/sources.list.d/nginx-plus.list
RUN curl -O https://nginx.org/keys/nginx_signing.key && apt-key add ./nginx_signing.key
RUN wget -qO - https://cs.nginx.com/static/keys/nginx_signing.key | gpg --dearmor |  tee /usr/share/keyrings/nginx-archive-keyring.gpg >/dev/null
RUN wget -qO - https://cs.nginx.com/static/keys/app-protect-security-updates.key | gpg --dearmor |  tee /usr/share/keyrings/app-protect-security-updates.gpg >/dev/null
RUN printf "deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg] https://pkgs.nginx.com/plus/debian `lsb_release -cs` nginx-plus\n" | tee /etc/apt/sources.list.d/nginx-plus.list
RUN  wget -P /etc/apt/apt.conf.d https://cs.nginx.com/static/files/90pkgs-nginx
RUN apt-get update && apt-get install -y nginx-plus

CMD ["nginx", "-g", "daemon off;"]
