# Roadmap Handlers

def handle_roadmap(environ, start_response, content_cache):
    """Handle roadmap list page."""
    from ..template import renderer
    from ..config import DYNAMIC_CACHE_MAX_AGE
    from ..utils import set_cache_headers

    roadmap = content_cache.cache.get('roadmap', [])
    roadmap_html = ''
    for item in roadmap:
        card_html = renderer.render('roadmap_card.html', item)
        roadmap_html += card_html
    context = {
        'title': 'Roadmap',
        'roadmap_html': roadmap_html
    }
    html = renderer.render_base('roadmap.html', context)
    headers = [('Content-Type', 'text/html; charset=utf-8')]
    set_cache_headers(headers, DYNAMIC_CACHE_MAX_AGE)
    start_response('200 OK', headers)
    return [html.encode('utf-8')]

def handle_roadmap_detail(environ, start_response, content_cache, slug):
    """Handle roadmap item detail page."""
    from ..template import renderer
    from ..config import DYNAMIC_CACHE_MAX_AGE, CONTENT_DIR
    from ..utils import set_cache_headers, safe_join

    roadmap = content_cache.cache.get('roadmap', [])
    item = next((i for i in roadmap if i['slug'] == slug), None)
    if not item:
        from ..server import serve_404
        return serve_404(environ, start_response)

    # Load detail content
    detail_path = safe_join(CONTENT_DIR, item['detail_path'])
    try:
        with open(detail_path, 'r', encoding='utf-8') as f:
            content_html = f.read()
    except:
        content_html = '<p>Detail not found.</p>'

    context = {
        'title': item['title'],
        'content_html': content_html,
        'status': item.get('status', 'unknown'),
        'metadata': item
    }
    html = renderer.render_base('roadmap_detail.html', context)
    headers = [('Content-Type', 'text/html; charset=utf-8')]
    set_cache_headers(headers, DYNAMIC_CACHE_MAX_AGE)
    start_response('200 OK', headers)
    return [html.encode('utf-8')]