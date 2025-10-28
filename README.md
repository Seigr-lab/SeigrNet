# Seigr.net

A lightweight, pure-Python web application serving the Seigr public website.

## Overview

Seigr.net is built with a focus on simplicity, security, and maintainability. It uses only Python's standard library, with no external dependencies, and follows a modular architecture separating HTML, CSS, and JavaScript.

## Features

- **Pure Python**: No external frameworks or dependencies
- **Modular Design**: Clean separation of concerns
- **Static File Serving**: Efficient caching and content-type handling
- **Content Management**: JSON-based metadata with HTML fragments
- **Admin API**: Secure content reloading endpoint
- **Responsive Design**: Mobile-first CSS with vanilla JavaScript

## Quick Start

1. **Prerequisites**: Python 3.6 or higher

2. **Clone and Navigate**:
   ```bash
   cd seigr-net
   ```

3. **Run the Server**:
   ```bash
   python serve.py
   ```

4. **Open in Browser**: Visit `http://localhost:8000`

## Project Structure

```
seigr-net/
├── app/                    # Application modules
│   ├── config.py          # Configuration settings
│   ├── server.py          # WSGI server and routing
│   ├── routes.py          # Route definitions
│   ├── handlers/          # Request handlers
│   ├── template.py        # Template rendering
│   ├── utils.py           # Utility functions
│   └── md2html.py         # Markdown converter
├── templates/             # HTML templates
├── static/                # CSS, JS, images
├── content/               # Site content
├── tests/                 # Unit tests
├── scripts/               # Utility scripts
├── serve.py               # Server entrypoint
└── README.md
```

## Development

### Adding Content

1. **Toolsets**: Update `content/lab/toolsets.json` and add HTML fragment in `content/lab/toolsets/`
2. **Roadmap Items**: Update `content/roadmap/roadmap.json` and add detail in `content/roadmap/items/`
3. **Pages**: Edit HTML files in `content/` for manifesto, beekeeping, music

### Running Tests

```bash
python -m unittest discover tests/
```

### Content Reloading

To reload content without restarting the server:

```bash
curl -X POST http://localhost:8000/admin/reload \
  -H "X-Admin-Token: your-admin-token"
```

## Security Notes

- Content files are authored by repository maintainers
- HTML fragments should be sanitized during authoring
- Admin token must be set securely in production
- No dynamic script execution from content