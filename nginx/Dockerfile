FROM nginx:1.27.1-alpine

RUN apk update

# Nginx Files
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./nginx/ssl /etc/nginx/ssl

# Client Static Files
COPY ./client /usr/share/nginx/html
RUN chown -R nginx:nginx /usr/share/nginx/html
RUN chmod -R 755 /usr/share/nginx/html

EXPOSE 80 443 

CMD ["nginx", "-g", "daemon off;"]