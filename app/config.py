# Seigr.net Configuration

import os

# Site configuration
SITE_TITLE = "Seigr.net"
SITE_DESCRIPTION = "Seigr's public website"
SITE_URL = "https://seigr.net"

# Admin configuration
ADMIN_TOKEN = os.getenv("SEIGR_ADMIN_TOKEN", "default-admin-token-change-in-production")

# Environment
DEBUG = os.getenv("SEIGR_ENV", "development") == "development"

# Server binding
BIND_HOST = os.getenv("SEIGR_BIND_HOST", "localhost")
BIND_PORT = int(os.getenv("SEIGR_BIND_PORT", "8000"))

# Content paths
CONTENT_DIR = "content"
TEMPLATES_DIR = "templates"
STATIC_DIR = "static"

# Caching
STATIC_CACHE_MAX_AGE = 31536000  # 1 year for immutable static files
DYNAMIC_CACHE_MAX_AGE = 60  # 1 minute for dynamic content