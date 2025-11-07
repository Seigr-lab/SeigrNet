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
        { href: `${basePath}html/sound.html`, text: 'Sound' },
        { href: `${basePath}html/manifesto.html`, text: 'Manifesto' }
    ];
    
    const navHTML = navLinks.map(link => {
        const active = isActive(link.href);
        return active 
            ? `<span class="nav-active">${link.text}</span>`
            : `<a href="${link.href}" onclick="closeMobileMenu()">${link.text}</a>`;
    }).join('');
    
    const headerHTML = `
        <div class="page-header">
            <div class="header-top">
                <div class="header-title-section">
                    <p>Seigr</p>
                    <p class="page-subtitle">a continuum of code, sound, and nature</p>
                </div>
                <button class="mobile-menu-toggle" onclick="toggleMobileMenu()" aria-label="Toggle menu">
                    <span class="hamburger-line"></span>
                    <span class="hamburger-line"></span>
                    <span class="hamburger-line"></span>
                </button>
            </div>
            
            <nav class="nav" id="main-nav">
                ${navHTML}
            </nav>
        </div>
    `;
    
    return headerHTML;
}

// Toggle mobile menu
function toggleMobileMenu() {
    const nav = document.getElementById('main-nav');
    const toggle = document.querySelector('.mobile-menu-toggle');
    
    if (nav && toggle) {
        const isOpen = nav.classList.contains('mobile-nav-open');
        
        if (isOpen) {
            nav.classList.remove('mobile-nav-open');
            toggle.classList.remove('menu-open');
        } else {
            nav.classList.add('mobile-nav-open');
            toggle.classList.add('menu-open');
        }
    }
}

// Close mobile menu
function closeMobileMenu() {
    const nav = document.getElementById('main-nav');
    const toggle = document.querySelector('.mobile-menu-toggle');
    
    if (nav && toggle) {
        nav.classList.remove('mobile-nav-open');
        toggle.classList.remove('menu-open');
    }
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const nav = document.getElementById('main-nav');
    const toggle = document.querySelector('.mobile-menu-toggle');
    
    if (nav && toggle && nav.classList.contains('mobile-nav-open')) {
        // Check if click is outside nav and toggle button
        if (!nav.contains(event.target) && !toggle.contains(event.target)) {
            nav.classList.remove('mobile-nav-open');
            toggle.classList.remove('menu-open');
        }
    }
});

// Function to inject header into page
function loadHeader() {
    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
        headerContainer.innerHTML = createHeader();
    }
}

// Load header when DOM is ready
document.addEventListener('DOMContentLoaded', loadHeader);