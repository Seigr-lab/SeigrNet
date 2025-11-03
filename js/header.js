// Reusable Header Component
// Simple approach: create header with paths based on data attribute
function createHeader() {
    // Get the base path from the container's data attribute
    const container = document.getElementById('header-container');
    const basePath = container ? container.getAttribute('data-base-path') || '' : '';
    
    const headerHTML = `
        <div class="page-header">
            <p>Seigr</p>
            <p class="page-subtitle">a continuum of code, sound, and nature</p>
            
            <nav class="nav">
                <a href="${basePath}index.html">Seigr Lab</a>
                <a href="${basePath}html/beekeeping.html">Beekeeping</a>
                <a href="${basePath}html/music.html">Music</a>
                <a href="${basePath}html/manifesto.html">Manifesto</a>
            </nav>
        </div>
    `;
    
    return headerHTML;
}

// Function to inject header into page
function loadHeader() {
    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
        headerContainer.innerHTML = createHeader();
    }
}

// Load header when DOM is ready
document.addEventListener('DOMContentLoaded', loadHeader);