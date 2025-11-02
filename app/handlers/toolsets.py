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
    """Handle toolset detail page with dynamic GitHub integration."""
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

    # Dynamic GitHub repository integration
    content_html = fetch_repo_content(toolset, logger)

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

def fetch_repo_content(toolset, logger):
    """Fetch and convert repository README content dynamically."""
    from ..md2html import md_to_html
    import urllib.request
    import urllib.error
    
    # Check if this toolset has a GitHub repository configured
    github_repo = toolset.get('github_repo')
    github_branch = toolset.get('github_branch', 'main')
    
    if github_repo:
        # Construct GitHub raw URL for README
        readme_url = f'https://raw.githubusercontent.com/{github_repo}/{github_branch}/README.md'
        repo_url = f'https://github.com/{github_repo}'
        
        try:
            logger.info(f"Fetching README from {readme_url}")
            with urllib.request.urlopen(readme_url, timeout=10) as response:
                readme_content = response.read().decode('utf-8')
                
                # Convert markdown to HTML with unified styling
                readme_html = md_to_html(readme_content)
                
                # Wrap in unified content structure
                content_html = f'''
                <div class="repo-header">
                    <h2>{toolset['title']}</h2>
                    <p class="repo-info">
                        <a href="{repo_url}" target="_blank" class="repo-link">
                            📦 View Repository →
                        </a>
                        <span class="repo-updated">Live content from GitHub</span>
                    </p>
                </div>
                <div class="repo-content">
                    {readme_html}
                </div>
                '''
                
                logger.info(f"Successfully fetched and converted README from {github_repo}")
                return content_html
                
        except urllib.error.URLError as e:
            logger.error(f"Failed to fetch README from {github_repo}: {e}")
            return f'''
            <div class="repo-header">
                <h2>{toolset['title']}</h2>
                <p class="error">Unable to fetch latest content from GitHub: {e}</p>
            </div>
            <div class="repo-content">
                <p>Please visit <a href="{repo_url}" target="_blank">the official repository</a> for the latest information.</p>
            </div>
            '''
        except Exception as e:
            logger.error(f"Error processing README from {github_repo}: {e}")
            return f'''
            <div class="repo-header">
                <h2>{toolset['title']}</h2>
                <p class="error">Error processing repository content: {e}</p>
            </div>
            '''
    
    # Fallback to local content for toolsets without GitHub integration
    from ..config import CONTENT_DIR
    from ..utils import safe_join
    detail_path = safe_join(CONTENT_DIR, toolset['detail_path'])
    try:
        with open(detail_path, 'r', encoding='utf-8') as f:
            return f.read()
    except:
        return '<p>Content not found.</p>'