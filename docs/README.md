# Seigr.net - Static GitHub Pages Site

This directory contains the static HTML version of Seigr.net that's served via GitHub Pages.

## Structure

- `index.html` - Main static page with complete Seigr information
- Custom CSS embedded in the HTML for GitHub Pages compatibility
- Self-contained with no external dependencies

## Features

- **Complete Seigr overview** - Manifesto, toolsets, roadmap, and about sections
- **Responsive design** - Works on all devices
- **GitHub Pages optimized** - No build process required
- **SEO friendly** - Proper meta tags and semantic HTML
- **Accessible** - Good color contrast and semantic structure

## Automatic Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to the main branch via GitHub Actions (`.github/workflows/pages.yml`).

## Live Site

Once deployed, the site will be available at:
`https://seigr-lab.github.io/SeigrNet/`

## Relationship to Dynamic Site

This static site complements the dynamic Python web application in the main directory:

- **Static site** (this) - GitHub Pages hosted, always available, SEO optimized
- **Dynamic site** (`serve.py`) - Live README fetching, local development, advanced features

Both sites share the same content and branding but serve different purposes.