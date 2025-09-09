import os
from datetime import timedelta

class Config:
    SECRET_KEY = 'x7k9p3m8q2w5z1r4t6y8n0j2h5f3d9g'
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:@localhost/carmarket'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    PERMANENT_SESSION_LIFETIME = timedelta(minutes=30)
    SESSION_COOKIE_SECURE = True  # Use HTTPS in production
    SESSION_COOKIE_HTTPONLY = True  # Prevent JS access to cookies
    SESSION_COOKIE_SAMESITE = 'Lax'  # CSRF protection