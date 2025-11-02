# Comprehensive but Clean Markdown Parser

import re

def md_to_html(markdown_text):
    """Convert markdown to clean, readable HTML."""
    if not markdown_text:
        return ''
    
    # Normalize line endings
    markdown_text = markdown_text.replace('\r\n', '\n').replace('\r', '\n')
    
    # Handle fenced code blocks first (before splitting)
    code_blocks = []
    def preserve_code_block(match):
        code_blocks.append(match.group(0))
        return f'__CODE_BLOCK_{len(code_blocks)-1}__'
    
    markdown_text = re.sub(r'```[\s\S]*?```', preserve_code_block, markdown_text)
    
    # Split into blocks
    blocks = re.split(r'\n\s*\n', markdown_text)
    html_blocks = []
    
    for block in blocks:
        block = block.strip()
        if not block:
            continue
            
        # Restore code blocks
        if block.startswith('__CODE_BLOCK_'):
            code_match = re.match(r'__CODE_BLOCK_(\d+)__', block)
            if code_match:
                original_code = code_blocks[int(code_match.group(1))]
                lines = original_code.split('\n')
                if len(lines) >= 3:
                    code_content = '\n'.join(lines[1:-1])
                    html_blocks.append(f'<pre><code>{_escape_html(code_content)}</code></pre>')
                continue
            
        # Headers
        if block.startswith('#'):
            header_match = re.match(r'^(#{1,6})\s+(.*)$', block)
            if header_match:
                level = len(header_match.group(1))
                title = header_match.group(2)
                html_blocks.append(f'<h{level}>{_process_inline(title)}</h{level}>')
                continue
        
        # Lists (handle multi-line items properly)
        if re.match(r'^[-*+]\s', block) or re.match(r'^\d+\.\s', block):
            html_blocks.append(_process_list(block))
            continue
            
        # Tables
        if '|' in block and _is_table(block):
            html_blocks.append(_process_table(block))
            continue
            
        # Regular paragraph
        html_blocks.append(f'<p>{_process_inline(block)}</p>')
    
    return '\n\n'.join(html_blocks)

def _is_table(block):
    """Check if block looks like a table."""
    lines = [line.strip() for line in block.split('\n') if line.strip()]
    pipe_lines = [line for line in lines if '|' in line and line.count('|') >= 2]
    return len(pipe_lines) >= 2

def _process_table(block):
    """Convert markdown table to HTML."""
    lines = [line.strip() for line in block.split('\n') if line.strip() and '|' in line]
    if len(lines) < 2:
        return f'<p>{_process_inline(block)}</p>'
    
    html = ['<table>']
    
    # Process each row
    for i, line in enumerate(lines):
        # Skip separator lines (like |---|---|)
        if re.match(r'^[\s|:-]+$', line):
            continue
            
        cells = [cell.strip() for cell in line.split('|') if cell.strip()]
        if not cells:
            continue
            
        if i == 0:  # First row is header
            html.append('<thead><tr>')
            for cell in cells:
                html.append(f'<th>{_process_inline(cell)}</th>')
            html.append('</tr></thead><tbody>')
        else:
            html.append('<tr>')
            for cell in cells:
                html.append(f'<td>{_process_inline(cell)}</td>')
            html.append('</tr>')
    
    html.append('</tbody></table>')
    return ''.join(html)





def _process_inline(text):
    """Process inline markdown elements properly."""
    # Store protected segments to avoid double processing
    protected_segments = []
    
    def protect_segment(match):
        protected_segments.append(match.group(0))
        return f'__PROTECTED_{len(protected_segments)-1}__'
    
    # Code spans first (protect from other processing)
    text = re.sub(r'`([^`]+)`', lambda m: protect_segment(m), text)
    
    # Links (protect from other processing)
    text = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', lambda m: protect_segment(m), text)
    
    # Bold - simple patterns without lookbehind
    text = re.sub(r'\*\*([^*]+?)\*\*', r'<strong>\1</strong>', text)
    text = re.sub(r'__([^_]+?)__', r'<strong>\1</strong>', text)
    
    # Italic - avoid conflicts with bold
    text = re.sub(r'(?<!\*)\*([^*\n]+?)\*(?!\*)', r'<em>\1</em>', text)
    text = re.sub(r'(?<!_)_([^_\n]+?)_(?!_)', r'<em>\1</em>', text)
    
    # Restore protected segments
    for i, segment in enumerate(protected_segments):
        placeholder = f'__PROTECTED_{i}__'
        if placeholder in text:
            # Process code and links properly
            if segment.startswith('`') and segment.endswith('`'):
                code_content = segment[1:-1]  # Remove backticks
                text = text.replace(placeholder, f'<code>{_escape_html(code_content)}</code>')
            elif '[' in segment and '](' in segment:
                # Process link
                link_match = re.match(r'\[([^\]]+)\]\(([^)]+)\)', segment)
                if link_match:
                    link_text = link_match.group(1)
                    link_url = link_match.group(2)
                    text = text.replace(placeholder, f'<a href="{link_url}" target="_blank">{link_text}</a>')
                else:
                    text = text.replace(placeholder, segment)
            else:
                text = text.replace(placeholder, segment)
    
    return text

def _process_list(block):
    """Process markdown list with proper multi-line support."""
    lines = block.split('\n')
    is_ordered = re.match(r'^\d+\.', lines[0])
    tag = 'ol' if is_ordered else 'ul'
    
    items = []
    current_item = ""
    
    for line in lines:
        stripped = line.strip()
        if not stripped:
            if current_item:
                current_item += ' '
            continue
            
        # Check if this starts a new list item
        if re.match(r'^[-*+]\s', stripped) or re.match(r'^\d+\.\s', stripped):
            # Save previous item
            if current_item:
                items.append(f'<li>{_process_inline(current_item.strip())}</li>')
            
            # Start new item
            if is_ordered:
                current_item = re.sub(r'^\d+\.\s*', '', stripped)
            else:
                current_item = re.sub(r'^[-*+]\s*', '', stripped)
        else:
            # Continuation of current item
            if current_item:
                current_item += ' ' + stripped
            else:
                current_item = stripped
    
    # Don't forget the last item
    if current_item:
        items.append(f'<li>{_process_inline(current_item.strip())}</li>')
    
    return f'<{tag}>\n' + '\n'.join(items) + f'\n</{tag}>'

def _escape_html(text):
    """Escape HTML special characters."""
    return text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;').replace("'", '&#x27;')