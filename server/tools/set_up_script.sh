#!/bin/sh

echo "Waiting for PostgreSQL..."
while ! nc -z postgres_db 5432; do
  sleep 1
done
echo "PostgreSQL is up - executing commands."

python manage.py migrate

exec python manage.py runserver 0.0.0.0:8000