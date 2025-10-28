# Seigr.net Utilities

import os
import hashlib
import mimetypes
from urllib.parse import quote

def safe_join(base, *paths):
    """Safely join paths to prevent directory traversal."""
    result = os.path.join(base, *paths)
    if not os.path.abspath(result).startswith(os.path.abspath(base)):
        raise ValueError("Path traversal detected")
    return result

def get_file_hash(filepath):
    """Generate SHA256 hash of file contents for ETags."""
    with open(filepath, 'rb') as f:
        return hashlib.sha256(f.read()).hexdigest()

def get_mime_type(filepath):
    """Get MIME type for file."""
    mime_type, _ = mimetypes.guess_type(filepath)
    return mime_type or 'application/octet-stream'

def slugify(text):
    """Convert text to URL-safe slug."""
    return quote(text.lower().replace(' ', '-').replace('_', '-'), safe='')

def set_cache_headers(response_headers, max_age):
    """Set Cache-Control headers."""
    response_headers.append(('Cache-Control', f'max-age={max_age}'))

def set_cache_headers_advanced(response_headers, max_age, s_maxage=None, immutable=False):
    """Set Cache-Control with optional s-maxage and immutable flag."""
    parts = [f'max-age={max_age}']
    if s_maxage is not None:
        parts.append(f's-maxage={s_maxage}')
    if immutable:
        parts.append('immutable')
    response_headers.append(('Cache-Control', ', '.join(parts)))

def set_etag_header(response_headers, etag):
    """Set ETag header."""
    response_headers.append(('ETag', f'"{etag}"'))