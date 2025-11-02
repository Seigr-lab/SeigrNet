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
    import urllib.request
    import urllib.error
    import logging

    logger = logging.getLogger(__name__)

    toolsets = content_cache.cache.get('toolsets', [])
    toolset = next((t for t in toolsets if t['slug'] == slug), None)
    if not toolset:
        from ..server import serve_404
        return serve_404(environ, start_response)

    # Special handling for Seigr Toolset Crypto - fetch README from GitHub
    if slug == 'seigr-toolset-crypto':
        readme_url = 'https://raw.githubusercontent.com/Seigr-lab/SeigrToolsetCrypto/00002f5587eac36e24f891b6cb8cfe5777bb09aa/README.md'
        try:
            logger.info(f"Fetching README from {readme_url}")
            with urllib.request.urlopen(readme_url, timeout=10) as response:
                readme_content = response.read().decode('utf-8')
                # Convert markdown to HTML
                from ..md2html import md_to_html
                content_html = f'<h2>Seigr Toolset Crypto</h2>\n{md_to_html(readme_content)}'
                logger.info("Successfully fetched and converted README")
        except urllib.error.URLError as e:
            logger.error(f"Failed to fetch README: {e}")
            content_html = f'<h2>Seigr Toolset Crypto</h2>\n<p class="error">Unable to fetch latest README from GitHub: {e}</p>\n<p>Please visit <a href="https://github.com/Seigr-lab/SeigrToolsetCrypto" target="_blank">the official repository</a> for the latest information.</p>'
        except Exception as e:
            logger.error(f"Error processing README: {e}")
            content_html = f'<h2>Seigr Toolset Crypto</h2>\n<p class="error">Error processing README: {e}</p>'
    else:
        # Load detail content from local file for other toolsets
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