# Seigr.net Template Renderer

import os
from string import Template
from .config import TEMPLATES_DIR
from .utils import safe_join

class TemplateRenderer:
    def __init__(self, templates_dir=TEMPLATES_DIR):
        self.templates_dir = templates_dir
        self.cache = {}

    def load_template(self, template_name):
        """Load and cache template."""
        if template_name not in self.cache:
            template_path = safe_join(self.templates_dir, template_name)
            with open(template_path, 'r', encoding='utf-8') as f:
                self.cache[template_name] = Template(f.read())
        return self.cache[template_name]

    def render(self, template_name, context=None):
        """Render template with context."""
        if context is None:
            context = {}
        template = self.load_template(template_name)
        # Convert context to string.Template safe format
        safe_context = {k: str(v) for k, v in context.items()}
        return template.safe_substitute(safe_context)

    def render_base(self, content_template, context=None):
        """Render content template and inject into base.html."""
        if context is None:
            context = {}
        content = self.render(content_template, context)
        base_context = context.copy()
        base_context['content'] = content
        return self.render('base.html', base_context)

# Global renderer instance
renderer = TemplateRenderer()