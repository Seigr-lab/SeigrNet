// Toolset Preview Loader
document.addEventListener('DOMContentLoaded', function() {
    const toolsetsContainer = document.querySelector('.toolsets');
    
    if (toolsetsContainer && toolsetsContainer.children.length === 0) {
        // Load toolsets if container is empty
        fetch('/api/toolsets')
            .then(response => response.json())
            .then(data => {
                toolsetsContainer.innerHTML = data.map(toolset => `
                    <div class="toolset-card">
                        <h2>${toolset.title}</h2>
                        ${toolset.short_html}
                        <a href="/lab/toolsets/${toolset.slug}/">View Details</a>
                    </div>
                `).join('');
            })
            .catch(error => console.error('Error loading toolsets:', error));
    }
});