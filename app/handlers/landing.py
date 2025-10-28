# Landing Page Handler

def handle_landing(environ, start_response, content_cache):
    """Handle landing page request."""
    from ..template import renderer
    from ..config import SITE_TITLE, DYNAMIC_CACHE_MAX_AGE
    from ..utils import set_cache_headers

    manifesto = content_cache.cache.get('manifesto', '')
    context = {
        'title': SITE_TITLE,
        'manifesto': manifesto
    }
    html = renderer.render_base('landing.html', context)
    headers = [('Content-Type', 'text/html; charset=utf-8')]
    set_cache_headers(headers, DYNAMIC_CACHE_MAX_AGE)
    start_response('200 OK', headers)
    return [html.encode('utf-8')]