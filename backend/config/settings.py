# config/settings.py

import os
from pathlib import Path
from datetime import timedelta
import environ

# --------------------------------------------------
# BASE DIRECTORY
# --------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent

# --------------------------------------------------
# ENVIRONMENT VARIABLES
# --------------------------------------------------
env = environ.Env(DEBUG=(bool, False))
environ.Env.read_env(os.path.join(BASE_DIR, ".env"))

# --------------------------------------------------
# SECURITY
# --------------------------------------------------
SECRET_KEY = env("SECRET_KEY")
DEBUG = env.bool("DEBUG", default=False)

ALLOWED_HOSTS = ["*"]

# --------------------------------------------------
# CSRF / CORS
# --------------------------------------------------
CSRF_TRUSTED_ORIGINS = [
    "http://127.0.0.1:8000",
    "http://localhost:8000",
    "http://192.168.10.7:8000",
    "https://*.loca.lt",
    "https://*.ngrok-free.app",
    "https://*.exp.direct",
    "https://*.expo.dev",
]

CORS_ALLOW_ALL_ORIGINS = True

# --------------------------------------------------
# DATABASE
# --------------------------------------------------
DATABASES = {
    "default": env.db()
}

# --------------------------------------------------
# STRIPE
# --------------------------------------------------
STRIPE_SECRET_KEY = env("STRIPE_SECRET_KEY")
STRIPE_WEBHOOK_SECRET = env("STRIPE_WEBHOOK_SECRET")
PAYMENT_AMOUNT_CENTS = env.int("PAYMENT_AMOUNT_CENTS", default=199)

# --------------------------------------------------
# TWILIO (LEGACY – STILL PRESENT)
# --------------------------------------------------
TWILIO_ACCOUNT_SID = env("TWILIO_ACCOUNT_SID", default="")
TWILIO_AUTH_TOKEN = env("TWILIO_AUTH_TOKEN", default="")
TWILIO_FROM_NUMBER = env("TWILIO_FROM_NUMBER", default="")

# --------------------------------------------------
# WHATSAPP CLOUD API (REQUIRED)
# --------------------------------------------------
WHATSAPP_API_VERSION = env("WHATSAPP_API_VERSION", default="v22.0")
WHATSAPP_PHONE_NUMBER_ID = env("WHATSAPP_PHONE_NUMBER_ID")
WHATSAPP_ACCESS_TOKEN = env("WHATSAPP_ACCESS_TOKEN")

# --------------------------------------------------
# SOCIAL LOGIN (TOKEN BASED – MOBILE)
# --------------------------------------------------
GOOGLE_WEB_CLIENT_ID = env("GOOGLE_WEB_CLIENT_ID")

# --------------------------------------------------
# INSTALLED APPS
# --------------------------------------------------
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    "rest_framework",
    "rest_framework_simplejwt",
    "corsheaders",
    "django_filters",

    "accounts",
    "articles",
    "comments",
    "contact",
    "payments",
    "notifications",
    "admin_features",
    "theming",
]

# --------------------------------------------------
# MIDDLEWARE
# --------------------------------------------------
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",

    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",

    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",

    "admin_features.middleware.AdminOnlyAPIMiddleware",
]

# --------------------------------------------------
# URL / APPLICATION
# --------------------------------------------------
ROOT_URLCONF = "config.urls"

WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

# --------------------------------------------------
# TEMPLATES
# --------------------------------------------------
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    }
]

# --------------------------------------------------
# AUTH
# --------------------------------------------------
AUTH_USER_MODEL = "accounts.CustomUser"

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# --------------------------------------------------
# INTERNATIONALIZATION
# --------------------------------------------------
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# --------------------------------------------------
# STATIC & MEDIA
# --------------------------------------------------
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_DIRS = [BASE_DIR / "static"]

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# --------------------------------------------------
# DRF
# --------------------------------------------------
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": env.int("PAGINATION_PER_PAGE", default=10),
}

# --------------------------------------------------
# JWT
# --------------------------------------------------
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=4),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "AUTH_HEADER_TYPES": ("Bearer",),
}

# --------------------------------------------------
# EMAIL
# --------------------------------------------------
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = env("EMAIL_HOST")
EMAIL_HOST_USER = env("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = env("EMAIL_HOST_PASSWORD")
EMAIL_PORT = env.int("EMAIL_PORT", default=587)
EMAIL_USE_TLS = True

DEFAULT_FROM_EMAIL = env("DEFAULT_FROM_EMAIL", default="noreply@example.com")
CONTACT_EMAIL = env("CONTACT_EMAIL", default=DEFAULT_FROM_EMAIL)

# --------------------------------------------------
# LOGGING
# --------------------------------------------------
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "WARNING",
    },
}
