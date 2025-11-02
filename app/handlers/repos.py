# Dynamic Repository Handler
# Dynamically display any Seigr repository with unified styling

def handle_repo(environ, start_response, content_cache, org='Seigr-lab', repo_name=None):
    """Handle dynamic repository display pages."""
    from ..template import renderer
    from ..config import DYNAMIC_CACHE_MAX_AGE
    from ..utils import set_cache_headers
    import urllib.request
    import urllib.error
    import logging

    logger = logging.getLogger(__name__)

    if not repo_name:
        from ..server import serve_404
        return serve_404(environ, start_response)

    # Fetch repository information from GitHub API
    repo_info = fetch_repo_info(org, repo_name, logger)
    if not repo_info:
        from ..server import serve_404
        return serve_404(environ, start_response)

    # Fetch README content
    readme_content = fetch_repo_readme(org, repo_name, logger)

    context = {
        'title': f"{repo_info['name']} - Seigr Repository",
        'repo_info': repo_info,
        'readme_html': readme_content,
        'repo_url': f"https://github.com/{org}/{repo_name}",
        'org': org,
        'repo_name': repo_name
    }

    html = renderer.render_base('repo_display.html', context)
    headers = [('Content-Type', 'text/html; charset=utf-8')]
    set_cache_headers(headers, DYNAMIC_CACHE_MAX_AGE)
    start_response('200 OK', headers)
    return [html.encode('utf-8')]

def fetch_repo_info(org, repo_name, logger):
    """Fetch repository metadata from GitHub API."""
    import json
    import urllib.request
    import urllib.error

    api_url = f'https://api.github.com/repos/{org}/{repo_name}'
    
    try:
        logger.info(f"Fetching repo info from {api_url}")
        with urllib.request.urlopen(api_url, timeout=10) as response:
            repo_data = json.loads(response.read().decode('utf-8'))
            
            return {
                'name': repo_data.get('name', repo_name),
                'description': repo_data.get('description', 'No description available'),
                'stars': repo_data.get('stargazers_count', 0),
                'forks': repo_data.get('forks_count', 0),
                'language': repo_data.get('language', 'Unknown'),
                'updated_at': repo_data.get('updated_at', ''),
                'topics': repo_data.get('topics', []),
                'license': repo_data.get('license', {}).get('name', 'No license') if repo_data.get('license') else 'No license'
            }
    except Exception as e:
        logger.error(f"Failed to fetch repo info for {org}/{repo_name}: {e}")
        return None

def fetch_repo_readme(org, repo_name, logger, branch='main'):
    """Fetch and convert repository README."""
    from ..md2html import md_to_html
    import urllib.request
    import urllib.error

    readme_url = f'https://raw.githubusercontent.com/{org}/{repo_name}/{branch}/README.md'
    
    try:
        logger.info(f"Fetching README from {readme_url}")
        with urllib.request.urlopen(readme_url, timeout=10) as response:
            readme_content = response.read().decode('utf-8')
            return md_to_html(readme_content)
    except urllib.error.HTTPError as e:
        if e.code == 404:
            # Try master branch as fallback
            if branch == 'main':
                logger.info(f"README not found on main branch, trying master")
                return fetch_repo_readme(org, repo_name, logger, 'master')
            else:
                logger.warning(f"No README found for {org}/{repo_name}")
                return '<p>No README file found in this repository.</p>'
    except Exception as e:
        logger.error(f"Error fetching README for {org}/{repo_name}: {e}")
        return f'<p class="error">Error loading README: {e}</p>'

def handle_seigr_repos(environ, start_response, content_cache):
    """Handle listing of all Seigr repositories."""
    from ..template import renderer
    from ..config import DYNAMIC_CACHE_MAX_AGE
    from ..utils import set_cache_headers
    import urllib.request
    import urllib.error
    import json
    import logging

    logger = logging.getLogger(__name__)

    # Fetch all repositories from Seigr-lab organization
    api_url = 'https://api.github.com/orgs/Seigr-lab/repos'
    
    try:
        logger.info(f"Fetching repositories from {api_url}")
        with urllib.request.urlopen(api_url, timeout=10) as response:
            repos_data = json.loads(response.read().decode('utf-8'))
            
            repos = []
            for repo in repos_data:
                if not repo.get('private', True):  # Only public repos
                    repos.append({
                        'name': repo.get('name'),
                        'description': repo.get('description', 'No description'),
                        'url': repo.get('html_url'),
                        'language': repo.get('language'),
                        'stars': repo.get('stargazers_count', 0),
                        'updated_at': repo.get('updated_at'),
                        'topics': repo.get('topics', [])
                    })
            
            # Sort by stars and recent activity
            repos.sort(key=lambda x: (x['stars'], x['updated_at']), reverse=True)
            
    except Exception as e:
        logger.error(f"Failed to fetch repositories: {e}")
        repos = []

    context = {
        'title': 'Seigr Repositories - All Projects',
        'repos': repos,
        'total_repos': len(repos)
    }

    html = renderer.render_base('repos_list.html', context)
    headers = [('Content-Type', 'text/html; charset=utf-8')]
    set_cache_headers(headers, DYNAMIC_CACHE_MAX_AGE)
    start_response('200 OK', headers)
    return [html.encode('utf-8')]