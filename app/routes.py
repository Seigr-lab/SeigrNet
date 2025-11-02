# Seigr.net Routes

# Route mappings
routes = {}

def handle_toolsets_api(environ, start_response, content_cache):
    """API endpoint for toolsets JSON."""
    import json
    toolsets = content_cache.cache.get('toolsets', [])
    json_data = json.dumps(toolsets).encode('utf-8')
    headers = [('Content-Type', 'application/json; charset=utf-8')]
    start_response('200 OK', headers)
    return [json_data]

# Add routes after handlers are defined
def setup_routes():
    from .handlers.landing import handle_landing
    from .handlers.lab import handle_lab
    from .handlers.toolsets import handle_toolsets
    from .handlers.roadmap import handle_roadmap
    from .handlers.beekeeping import handle_beekeeping
    from .handlers.music import handle_music
    from .handlers.repos import handle_seigr_repos, handle_repo

    routes.update({
        '/': handle_landing,
        '/lab': handle_lab,
        '/lab/toolsets': handle_toolsets,
        '/lab/roadmap': handle_roadmap,
        '/beekeeping': handle_beekeeping,
        '/music': handle_music,
        '/api/toolsets': handle_toolsets_api,
        '/repos': handle_seigr_repos,
    })

setup_routes()