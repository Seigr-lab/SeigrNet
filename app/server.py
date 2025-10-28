# Seigr.net WSGI Server

import os
import json
import logging
from wsgiref.util import FileWrapper
from .config import *
from .utils import safe_join, get_file_hash, get_mime_type, set_cache_headers, set_etag_header
from .template import renderer
from .routes import routes

# Setup logging
logging.basicConfig(level=logging.INFO if not DEBUG else logging.DEBUG)
logger = logging.getLogger(__name__)

class ContentCache:
    def __init__(self):
        self.cache = {}
        self.load_content()

    def load_content(self):
        """Load all content files into cache."""
        try:
            # Load manifesto
            manifesto_path = safe_join(CONTENT_DIR, 'manifesto.html')
            with open(manifesto_path, 'r', encoding='utf-8') as f:
                self.cache['manifesto'] = f.read()

            # Load toolsets
            toolsets_path = safe_join(CONTENT_DIR, 'lab', 'toolsets.json')
            with open(toolsets_path, 'r', encoding='utf-8') as f:
                self.cache['toolsets'] = json.load(f)

            # Load roadmap
            roadmap_path = safe_join(CONTENT_DIR, 'roadmap', 'roadmap.json')
            with open(roadmap_path, 'r', encoding='utf-8') as f:
                self.cache['roadmap'] = json.load(f)

            # Load other pages
            for page in ['beekeeping', 'music']:
                page_path = safe_join(CONTENT_DIR, f'{page}.html')
                with open(page_path, 'r', encoding='utf-8') as f:
                    self.cache[page] = f.read()

            logger.info("Content loaded successfully")
        except Exception as e:
            logger.error(f"Error loading content: {e}")

    def reload(self):
        """Reload content cache."""
        self.cache.clear()
        self.load_content()

# Global content cache
content_cache = ContentCache()

def create_app():
    """WSGI application factory."""
    def app(environ, start_response):
        path = environ['PATH_INFO']
        method = environ['REQUEST_METHOD']

        # Handle routes
        handler = routes.get(path)
        if handler:
            return handler(environ, start_response, content_cache)

        # Handle dynamic routes
        if path.startswith('/lab/toolsets/') and path.endswith('/'):
            slug = path[len('/lab/toolsets/'):-1]
            from .handlers.toolsets import handle_toolset_detail
            return handle_toolset_detail(environ, start_response, content_cache, slug)
        
        if path.startswith('/lab/roadmap/') and path.endswith('/'):
            slug = path[len('/lab/roadmap/'):-1]
            from .handlers.roadmap import handle_roadmap_detail
            return handle_roadmap_detail(environ, start_response, content_cache, slug)
        
        # Admin reload
        if path == '/admin/reload' and method == 'POST':
            from .config import ADMIN_TOKEN
            token = environ.get('HTTP_X_ADMIN_TOKEN')
            if token != ADMIN_TOKEN:
                start_response('403 Forbidden', [('Content-Type', 'text/plain')])
                return [b'Forbidden']
            content_cache.reload()
            start_response('200 OK', [('Content-Type', 'text/plain')])
            return [b'Content reloaded']

        # Handle static files
        if path.startswith('/static/'):
            return serve_static(environ, start_response, path)

        # 404
        return serve_404(environ, start_response)

    return app

def serve_static(environ, start_response, path):
    """Serve static files."""
    try:
        static_path = safe_join(STATIC_DIR, path[len('/static/'):])
        if not os.path.isfile(static_path):
            return serve_404(environ, start_response)

        mime_type = get_mime_type(static_path)
        etag = get_file_hash(static_path)

        # Check If-None-Match
        if_none_match = environ.get('HTTP_IF_NONE_MATCH')
        if if_none_match and if_none_match.strip('"') == etag:
            start_response('304 Not Modified', [('ETag', f'"{etag}"')])
            return []

        headers = [('Content-Type', mime_type)]
        set_etag_header(headers, etag)
        set_cache_headers(headers, STATIC_CACHE_MAX_AGE)

        start_response('200 OK', headers)
        return FileWrapper(open(static_path, 'rb'))
    except Exception as e:
        logger.error(f"Error serving static file {path}: {e}")
        return serve_500(environ, start_response)

def serve_404(environ, start_response):
    """Serve 404 page."""
    try:
        html = renderer.render_base('404.html', {'title': 'Page Not Found'})
        headers = [('Content-Type', 'text/html; charset=utf-8')]
        set_cache_headers(headers, DYNAMIC_CACHE_MAX_AGE)
        start_response('404 Not Found', headers)
        return [html.encode('utf-8')]
    except Exception as e:
        logger.error(f"Error serving 404: {e}")
        return serve_500(environ, start_response)

def serve_500(environ, start_response):
    """Serve 500 error."""
    html = "<html><body><h1>Internal Server Error</h1></body></html>"
    start_response('500 Internal Server Error', [('Content-Type', 'text/html')])
    return [html.encode('utf-8')]