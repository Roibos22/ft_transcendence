FROM nginx:1.27.1-alpine

RUN apk update


COPY ./configs/nginx.conf /etc/nginx/conf.d/default.conf


EXPOSE 3000


CMD ["nginx", "-c", "/etc/nginx/nginx.conf", "-g", "daemon off;"]
