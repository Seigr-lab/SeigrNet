# Toolsets Handlers

def handle_toolsets(environ, start_response, content_cache):
    """Handle toolsets list page."""
    accept = environ.get('HTTP_ACCEPT', '')
    if 'application/json' in accept:
        import json
        toolsets = content_cache.cache.get('toolsets', [])
        json_data = json.dumps(toolsets).encode('utf-8')
        headers = [('Content-Type', 'application/json; charset=utf-8')]
        start_response('200 OK', headers)
        return [json_data]
    else:
        # Same as lab
        from .lab import handle_lab
        return handle_lab(environ, start_response, content_cache)

def handle_toolset_detail(environ, start_response, content_cache, slug):
    """Handle toolset detail page."""
    from ..template import renderer
    from ..config import DYNAMIC_CACHE_MAX_AGE, CONTENT_DIR
    from ..utils import set_cache_headers, safe_join

    toolsets = content_cache.cache.get('toolsets', [])
    toolset = next((t for t in toolsets if t['slug'] == slug), None)
    if not toolset:
        from ..server import serve_404
        return serve_404(environ, start_response)

    # Load detail content
    detail_path = safe_join(CONTENT_DIR, toolset['detail_path'])
    try:
        with open(detail_path, 'r', encoding='utf-8') as f:
            content_html = f.read()
    except:
        content_html = '<p>Content not found.</p>'

    context = {
        'title': toolset['title'],
        'content_html': content_html,
        'metadata': toolset
    }
    html = renderer.render_base('toolset_detail.html', context)
    headers = [('Content-Type', 'text/html; charset=utf-8')]
    set_cache_headers(headers, DYNAMIC_CACHE_MAX_AGE)
    start_response('200 OK', headers)
    return [html.encode('utf-8')]