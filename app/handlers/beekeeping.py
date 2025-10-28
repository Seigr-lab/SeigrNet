# Beekeeping Page Handler

def handle_beekeeping(environ, start_response, content_cache):
    """Handle beekeeping page."""
    from ..template import renderer
    from ..config import DYNAMIC_CACHE_MAX_AGE
    from ..utils import set_cache_headers

    content = content_cache.cache.get('beekeeping', '<p>Beekeeping content not found.</p>')
    context = {
        'title': 'Beekeeping',
        'content': content
    }
    html = renderer.render_base('beekeeping.html', context)
    headers = [('Content-Type', 'text/html; charset=utf-8')]
    set_cache_headers(headers, DYNAMIC_CACHE_MAX_AGE)
    start_response('200 OK', headers)
    return [html.encode('utf-8')]