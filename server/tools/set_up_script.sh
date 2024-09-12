#!/bin/sh

echo "Waiting for PostgreSQL..."
while ! nc -z postgres_db 5432; do
  sleep 1
done
echo "PostgreSQL is up - executing commands."

python manage.py makemigrations
python manage.py migrate

# exec python manage.py runserver 0.0.0.0:8000
exec daphne -b 0.0.0.0 -p 8000 transcendence_server.asgi:application
