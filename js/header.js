// Reusable Header Component
// Simple approach: create header with paths based on data attribute
function createHeader() {
    // Get the base path from the container's data attribute
    const container = document.getElementById('header-container');
    const basePath = container ? container.getAttribute('data-base-path') || '' : '';
    
    // Detect current page for active states (GitHub Pages compatible)
    const currentPath = window.location.pathname.toLowerCase();
    const currentFile = currentPath.split('/').pop() || 'index.html';
    
    // Function to check if a link should be active
    function isActive(linkPath) {
        const linkFile = linkPath.split('/').pop().toLowerCase();
        
        // Handle root/index page
        if (linkFile === 'index.html') {
            return currentFile === 'index.html' || 
                   currentFile === '' || 
                   currentPath.endsWith('/') ||
                   currentPath === '/' ||
                   currentPath.includes('/index.html');
        }
        
        // Handle other pages
        return currentPath.includes(linkFile) || currentFile === linkFile;
    }
    
    // Generate nav links with active states
    const navLinks = [
        { href: `${basePath}index.html`, text: 'Seigr Lab' },
        { href: `${basePath}html/beekeeping.html`, text: 'Beekeeping' },
        { href: `${basePath}html/music.html`, text: 'Music' },
        { href: `${basePath}html/manifesto.html`, text: 'Manifesto' }
    ];
    
    const navHTML = navLinks.map(link => {
        const active = isActive(link.href);
        return active 
            ? `<span class="nav-active">${link.text}</span>`
            : `<a href="${link.href}">${link.text}</a>`;
    }).join('');
    
    const headerHTML = `
        <div class="page-header">
            <p>Seigr</p>
            <p class="page-subtitle">a continuum of code, sound, and nature</p>
            
            <nav class="nav">
                ${navHTML}
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