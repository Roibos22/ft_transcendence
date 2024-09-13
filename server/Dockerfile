FROM python:3.10-alpine

RUN apk update && \
    apk add --no-cache \
    postgresql-client \
    postgresql-dev \
    build-base \
    nano

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV DJANGO_SETTINGS_MODULE=transcendence_server.settings

WORKDIR /app

RUN mkdir /app/avatars

COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app/

COPY ./assets/default_avatar.png /app/avatars/

EXPOSE 8000

CMD ["sh", "tools/set_up_script.sh"]
