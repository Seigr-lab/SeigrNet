# Seigr Web App - Content Management Guide

This guide explains how to update and manage content on the Seigr website without touching code.

## Content Structure

All user-editable content is located in the `content/` directory.

### Page Content (HTML files)

Simple pages use HTML files that are loaded directly:

- `content/manifesto.html` - The manifesto/landing page
- `content/beekeeping.html` - Beekeeping page content
- `content/music.html` - Music page content

**To update these pages:**
1. Edit the HTML file directly
2. Reload the content cache via admin endpoint (see below)
3. Changes appear immediately

**Important:** Do NOT include duplicate `<h1>` or `<h2>` tags that repeat the page name, as the page title is already set in the navigation.

### Toolsets (Lab Page)

Toolsets are managed via JSON and individual HTML files:

**JSON Index:** `content/lab/toolsets.json`

```json
[
    {
        "title": "Toolset Name",
        "slug": "toolset-url-slug",
        "short_html": "<p>Brief description shown on cards</p>",
        "detail_path": "lab/toolsets/filename.html",
        "thumbnail": "static/img/image.png",
        "tags": ["tag1", "tag2"]
    }
]
```

**Detail Files:** `content/lab/toolsets/*.html`

Each toolset detail file should:
- Start with an `<h2>` containing the toolset name
- Include comprehensive content about the toolset
- Use semantic HTML (h3, ul, p, etc.)

**To add a new toolset:**
1. Create the HTML detail file in `content/lab/toolsets/`
2. Add an entry to `toolsets.json`
3. Reload content cache
4. The new toolset appears on the Lab page

### Roadmap

Roadmap items work similarly to toolsets:

**JSON Index:** `content/roadmap/roadmap.json`

```json
[
    {
        "title": "Roadmap Item",
        "slug": "item-url-slug",
        "status": "active|planning|completed|etc",
        "summary_html": "<p>Brief summary for cards</p>",
        "detail_path": "roadmap/items/filename.html",
        "priority": 1
    }
]
```

**Detail Files:** `content/roadmap/items/*.html`

Each roadmap detail file should:
- Start with an `<h2>` containing the item name
- Include current status information
- List objectives and milestones
- Use semantic HTML

**To add a new roadmap item:**
1. Create the HTML detail file in `content/roadmap/items/`
2. Add an entry to `roadmap.json`
3. Reload content cache
4. The new item appears on the Roadmap page

## Content Reload

After making changes to any content files, reload the cache:

```bash
curl -X POST http://localhost:8000/admin/reload \
  -H "X-Admin-Token: your-admin-token-here"
```

Or programmatically restart the server for development.

## Best Practices

### HTML Content Guidelines

1. **No duplicate titles**: Don't repeat the page/section name as an H1/H2 if it's already in the navigation
2. **Semantic structure**: Use proper heading hierarchy (h2 → h3 → h4)
3. **Consistent styling**: Use standard HTML elements that are styled by the CSS
4. **Keep it simple**: Avoid inline styles or complex nested structures

### JSON Guidelines

1. **Unique slugs**: Each item must have a unique URL slug
2. **Valid paths**: Ensure `detail_path` points to an existing file
3. **Consistent format**: Keep JSON properly formatted and validated
4. **Short summaries**: Keep `short_html` and `summary_html` brief (1-2 sentences)

### File Organization

```
content/
├── manifesto.html           # Landing page
├── beekeeping.html         # Beekeeping page
├── music.html              # Music page
├── lab/
│   ├── toolsets.json       # Toolsets index
│   └── toolsets/
│       ├── toolset1.html   # Individual toolset details
│       └── toolset2.html
└── roadmap/
    ├── roadmap.json        # Roadmap index
    └── items/
        ├── item1.html      # Individual roadmap item details
        └── item2.html
```

## Navigation System

The website uses a breadcrumb-based navigation:

- **Card pages** (toolsets/roadmap) display a "Back" link to return to the list
- **List pages** show all cards with links to details
- **Main navigation** is always available in the top nav bar

Users can always:
1. Click the back link on detail pages to return to the list
2. Use browser back button
3. Click any nav menu item to jump to that section

## Troubleshooting

### Changes not appearing?
- Reload the content cache using the admin endpoint
- Check browser cache (hard refresh with Ctrl+Shift+R)
- Verify file paths in JSON are correct

### JSON not loading?
- Validate JSON syntax (use a JSON validator)
- Check file encoding is UTF-8
- Ensure all required fields are present

### Content looks broken?
- Check for unclosed HTML tags
- Avoid using unsupported HTML elements
- Keep structure simple and semantic

## Example: Adding a New Toolset

1. Create `content/lab/toolsets/my-new-tool.html`:
```html
<h2>My New Tool</h2>

<p>This is an amazing new tool that does incredible things.</p>

<h3>Features</h3>
<ul>
    <li>Feature 1</li>
    <li>Feature 2</li>
    <li>Feature 3</li>
</ul>

<h3>Status</h3>
<p>Currently in development.</p>
```

2. Add to `content/lab/toolsets.json`:
```json
{
    "title": "My New Tool",
    "slug": "my-new-tool",
    "short_html": "<p>An amazing new tool for incredible things.</p>",
    "detail_path": "lab/toolsets/my-new-tool.html",
    "thumbnail": "static/img/tool-placeholder.png",
    "tags": ["new", "development"]
}
```

3. Reload content cache

4. Visit `/lab` to see the new card, click it to see the detail page
