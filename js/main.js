// Seigr.net Static Website JavaScript

// Project data embedded directly (no file fetching needed)
const PROJECTS_DATA = {
    'seigr-toolset-crypto': {
        name: 'seigr-toolset-crypto',
        displayName: 'Seigr Toolset Crypto',
        shortDescription: 'Post-classical cryptographic engine with entropy-regenerative architecture',
        description: 'STC v0.3.1 is a cryptographic system implementing post-classical techniques. It uses lattice-based entropy, multi-path hashing, and automated profile selection. New in v0.3.1: Automated Security Profiles - File Type Detection detects file types using extensions and binary signatures, 19 Predefined Profiles provide different parameter sets for documents, media, credentials, etc. Content Analysis uses pattern matching for keywords and file structure analysis. Profile Selection automatically selects parameters based on detected file type. Command-Line Interface provides CLI tool for file encryption/decryption. Core Cryptographic Components include Continuous Entropy Lattice (CEL) for lattice-based entropy generation with quality metrics, Probabilistic Hashing Engine (PHE) for multi-path hashing with configurable path count, Contextual Key Emergence (CKE) for key derivation from lattice state intersections, Data-State Folding (DSF) for data transformation using tensor operations, Polymorphic Cryptographic Flow (PCF) for parameter modification based on entropy state, Decoy System for variable-count fake data vectors for obfuscation, and State Persistence for serialization of cryptographic state to binary format.',
        language: 'Python',
        stars: 0,
        topics: ['alpha', 'cryptographic-algorithms', 'cryptography'],
        github_url: 'https://github.com/Seigr-lab/SeigrToolsetCrypto',

    },
    
    'seigr-toolset-database': {
        name: 'seigr-toolset-database',
        displayName: 'Seigr Toolset Database',
        shortDescription: 'High-performance 4D spatiotemporal database with GPU acceleration',
        description: 'High-performance 4D spatiotemporal database with GPU acceleration, binary TLV protocol, and web-based management interface for distributed Seigr network operations',
        language: 'Python',
        stars: 0,
        topics: ['alpha', 'database', '4d-spatial', 'gpu-acceleration', 'binary-protocol', 'web-interface', 'distributed-systems', 'cuda'],
        github_url: 'https://github.com/Seigr-lab/SeigrToolsetDatabase'
    }
};

// Load project information from embedded data
function loadRepositories() {
    try {
        const projects = Object.values(PROJECTS_DATA);
        displayRepositories(projects);
        
    } catch (error) {
        console.error('Error loading projects:', error);
        const loading = document.getElementById('repos-loading');
        const errorDiv = document.getElementById('repos-error');
        
        if (loading) loading.style.display = 'none';
        if (errorDiv) {
            errorDiv.style.display = 'block';
            errorDiv.innerHTML = '<p>Unable to load project information. Please try refreshing the page.</p>';
        }
    }
}



function displayRepositories(projects) {
    const container = document.getElementById('repos-container');
    const loading = document.getElementById('repos-loading');
    
    if (projects.length === 0) {
        loading.textContent = 'No projects found.';
        return;
    }

    container.innerHTML = projects.map(project => `
        <div class="card repo-card" data-repo="${project.name}">
            <div class="repo-header">
                <h3>
                    <a href="#" onclick="loadProjectReadme('${project.name}'); return false;">
                        ${project.displayName || project.name}
                    </a>
                </h3>
                <div class="repo-stats">
                    ${project.language ? `<span>${project.language}</span>` : ''}
                </div>
            </div>
            
            <p class="repo-description">${project.shortDescription || 'No description available'}</p>
            
            ${project.topics && project.topics.length > 0 ? `
                <div class="repo-topics">
                    ${project.topics.slice(0, 3).map(topic => `<span class="topic-tag">${topic}</span>`).join('')}
                    ${project.topics.length > 3 ? `<span class="topic-tag">+${project.topics.length - 3} more</span>` : ''}
                </div>
            ` : ''}
            
            <div class="repo-actions">
                <a href="#" onclick="loadProjectReadme('${project.name}'); return false;" class="view-docs">
                    About This Project
                </a>
                ${project.github_url ? `<a href="${project.github_url}" target="_blank" class="view-github">GitHub →</a>` : ''}
            </div>
            
            <div class="repo-readme" id="readme-${project.name}" style="display: none;">
                <div class="readme-loading">Loading...</div>
            </div>
        </div>
    `).join('');

    loading.style.display = 'none';
    container.style.display = 'grid';
}

function loadProjectReadme(projectName) {
    const readmeContainer = document.getElementById(`readme-${projectName}`);
    const isVisible = readmeContainer.style.display !== 'none';
    
    // Toggle visibility
    if (isVisible) {
        readmeContainer.style.display = 'none';
        return;
    }
    
    readmeContainer.style.display = 'block';
    
    const projectData = PROJECTS_DATA[projectName];
    
    if (!projectData) {
        readmeContainer.innerHTML = '<div class="readme-error">Project not found</div>';
        return;
    }
    
    // Display project info directly - no markdown needed!
    readmeContainer.innerHTML = `
        <div class="project-details">
            <h4>${projectData.displayName}</h4>
            <p><strong>Description:</strong> ${projectData.description}</p>
            <p><strong>Language:</strong> ${projectData.language}</p>
            <p><strong>Topics:</strong> ${projectData.topics.join(', ')}</p>
            ${projectData.github_url ? `<p><strong>Repository:</strong> <a href="${projectData.github_url}" target="_blank">View on GitHub</a></p>` : ''}
        </div>
    `;
}



// Load repositories when page loads (only on pages that have the repos container)
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('repos-container')) {
        loadRepositories();
    }
});