# Music Page Handler

def handle_music(environ, start_response, content_cache):
    """Handle music page."""
    from ..template import renderer
    from ..config import DYNAMIC_CACHE_MAX_AGE
    from ..utils import set_cache_headers

    content = content_cache.cache.get('music', '<p>Music content not found.</p>')
    context = {
        'title': 'Music',
        'content': content
    }
    html = renderer.render_base('music.html', context)
    headers = [('Content-Type', 'text/html; charset=utf-8')]
    set_cache_headers(headers, DYNAMIC_CACHE_MAX_AGE)
    start_response('200 OK', headers)
    return [html.encode('utf-8')]