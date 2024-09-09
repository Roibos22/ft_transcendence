#!/bin/sh

echo "Waiting for PostgreSQL..."
while ! nc -z postgres_db 5432; do
  sleep 1
done
echo "PostgreSQL is up - executing commands."

python manage.py makemigrations
python manage.py migrate

echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser('ddavlet', 'dilshod95@google.com', 'P@ss1331')" | python manage.py shell

exec python manage.py runserver 0.0.0.0:8000
