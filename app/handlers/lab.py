# Lab Page Handler

def handle_lab(environ, start_response, content_cache):
    """Handle lab overview page."""
    from ..template import renderer
    from ..config import DYNAMIC_CACHE_MAX_AGE
    from ..utils import set_cache_headers

    toolsets = content_cache.cache.get('toolsets', [])
    toolsets_html = ''
    for t in toolsets:
        card_html = renderer.render('toolset_card.html', t)
        toolsets_html += card_html
    context = {
        'title': 'Seigr Lab',
        'toolsets_html': toolsets_html
    }
    html = renderer.render_base('lab.html', context)
    headers = [('Content-Type', 'text/html; charset=utf-8')]
    set_cache_headers(headers, DYNAMIC_CACHE_MAX_AGE)
    start_response('200 OK', headers)
    return [html.encode('utf-8')]