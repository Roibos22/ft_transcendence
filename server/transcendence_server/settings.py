"""
Django settings for transcendence_server project.

Generated by 'django-admin startproject' using Django 5.1.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.1/ref/settings/
"""

from pathlib import Path

from corsheaders.defaults import default_headers

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-7f^-%ra#sj3m)1h=)@!!6dud8d9@fk+b!*!lyqp$va@u*(7^vh'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['server', 'localhost']


# Application definition

INSTALLED_APPS = [
    'users.apps.UsersConfig',
    'game.apps.GameConfig',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    # OAuth 2.0
    'oauth2_provider',
    # 2FA
    'django_otp',  # Core OTP support
    'django_otp.plugins.otp_totp',  # Time-based OTP support (Google Authenticator, etc.)
    'two_factor',  # Main two-factor auth app
    # CORS
    'corsheaders',
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        # 'oauth2_provider.contrib.rest_framework.OAuth2Authentication'
    ),
}

# Dev mode
EMAIL_BACKEND = 'django.core.mail.backends.filebased.EmailBackend'
EMAIL_FILE_PATH = '/tmp/app-emails'  # Directory to save email files


# EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.example.com'  # Your email provider's SMTP server
EMAIL_PORT = 587  # Common port for SMTP over TLS (secure)
EMAIL_USE_TLS = True  # Use TLS (True) or SSL (False)
EMAIL_HOST_USER = 'your-email@example.com'  # Your email address (for sending emails)
EMAIL_HOST_PASSWORD = 'your-email-password'  # Your email password
DEFAULT_FROM_EMAIL = 'your-email@example.com'  # The default "from" email address

LOGIN_URL = '/users/login/'

# development temp
# adjust lifetime
from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),  # Adjust access token lifetime
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),    # Adjust refresh token lifetime
    'ROTATE_REFRESH_TOKENS': True,
}

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django_otp.middleware.OTPMiddleware',
    'corsheaders.middleware.CorsMiddleware',
]

# CORS_ALLOWED_ORIGINS = [
#     'http://localhost:3000',
#     'http://127.0.0.1:3000',
# ]

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = list(default_headers) + [
    'Authorization',
    'Content-Type',
]
ROOT_URLCONF = 'transcendence_server.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'transcendence_server.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'trans_db',
        'USER': 'admin',
        'PASSWORD': 'root',
        'HOST': 'postgres_db',
        'PORT': '5432',
    }
}


AUTH_USER_MODEL = 'users.User'

# To connect using a service name from the connection service file and a password from the password file, you must specify them in the OPTIONS part of your database configuration in DATABASES:
# DATABASES = {
#     "default": {
#         "ENGINE": "django.db.backends.postgresql",
#         "OPTIONS": {
#             "service": "my_service",
#             "passfile": ".my_pgpass",
#         },
#     }
# }


# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Europe/Berlin'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
