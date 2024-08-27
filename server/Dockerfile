FROM python:3.10-alpine

RUN apk update && \
    apk add --no-cache \
    postgresql-client \
    postgresql-dev \
    build-base \
    nano

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app/

EXPOSE 8000

CMD ["sh", "tools/set_up_script.sh"]