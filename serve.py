#!/usr/bin/env python3

"""
Seigr.net WSGI Server Entrypoint

This script starts the Seigr.net web application using Python's built-in WSGI server.
For production deployment, consider using a more robust WSGI server like Gunicorn.
"""

from wsgiref.simple_server import make_server
from app.server import create_app
from app.config import BIND_HOST, BIND_PORT, DEBUG

if __name__ == '__main__':
    app = create_app()
    server = make_server(BIND_HOST, BIND_PORT, app)
    print(f"Serving Seigr.net on http://{BIND_HOST}:{BIND_PORT}")
    if DEBUG:
        print("Debug mode enabled")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...")
        server.shutdown()