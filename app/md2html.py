# Minimal Markdown to HTML Converter

import re

def md_to_html(markdown_text):
    """Convert minimal markdown subset to HTML."""
    # Headers
    markdown_text = re.sub(r'^### (.*)$', r'<h3>\1</h3>', markdown_text, flags=re.MULTILINE)
    markdown_text = re.sub(r'^## (.*)$', r'<h2>\1</h2>', markdown_text, flags=re.MULTILINE)
    markdown_text = re.sub(r'^# (.*)$', r'<h1>\1</h1>', markdown_text, flags=re.MULTILINE)

    # Bold
    markdown_text = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', markdown_text)

    # Italic
    markdown_text = re.sub(r'\*(.*?)\*', r'<em>\1</em>', markdown_text)

    # Links
    markdown_text = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2">\1</a>', markdown_text)

    # Paragraphs
    lines = markdown_text.split('\n')
    html_lines = []
    in_paragraph = False
    for line in lines:
        line = line.strip()
        if line:
            if not in_paragraph:
                html_lines.append('<p>')
                in_paragraph = True
            html_lines.append(line)
        else:
            if in_paragraph:
                html_lines.append('</p>')
                in_paragraph = False
    if in_paragraph:
        html_lines.append('</p>')
    return '\n'.join(html_lines)