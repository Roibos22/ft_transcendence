# Use an official Python runtime as a parent image
# FROM python:3.11-slim
FROM python:3.10-alpine

RUN apk update && apk add nano

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory inside the container
WORKDIR /app

# Install dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the Django project into the container
COPY . /app/

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

# Run the Django application using Gunicorn
# CMD ["gunicorn", "mysite.wsgi:application", "--bind", "0.0.0.0:8000"]