// Seigr.net Static Website JavaScript

// Dynamic repository loading from GitHub API
async function loadRepositories() {
    try {
        const response = await fetch('https://api.github.com/orgs/Seigr-lab/repos?sort=updated&per_page=100');
        
        if (!response.ok) {
            if (response.status === 403) {
                throw new Error('GitHub API rate limit reached. Please try again later.');
            }
            throw new Error(`GitHub API error: ${response.status}`);
        }
        
        const repos = await response.json();
        const publicRepos = repos.filter(repo => 
            !repo.private && 
            repo.name !== 'SeigrNet' && // Exclude this website repo
            repo.name.toLowerCase() !== 'seigrnet' // Case insensitive
        );
        
        // Sort by stars and recent activity
        publicRepos.sort((a, b) => {
            const scoreA = a.stargazers_count * 10 + (a.updated_at > a.created_at ? 5 : 0);
            const scoreB = b.stargazers_count * 10 + (b.updated_at > b.created_at ? 5 : 0);
            return scoreB - scoreA;
        });

        displayRepositories(publicRepos);
        
    } catch (error) {
        console.error('Error loading repositories:', error);
        const loading = document.getElementById('repos-loading');
        const errorDiv = document.getElementById('repos-error');
        
        if (loading) loading.style.display = 'none';
        if (errorDiv) {
            errorDiv.style.display = 'block';
            if (error.message.includes('rate limit')) {
                errorDiv.innerHTML = '<p>GitHub API rate limit reached. Please try again in a few minutes or visit our <a href="https://github.com/Seigr-lab" target="_blank">GitHub organization</a> directly.</p>';
            }
        }
    }
}

function displayRepositories(repos) {
    const container = document.getElementById('repos-container');
    const loading = document.getElementById('repos-loading');
    
    if (repos.length === 0) {
        loading.textContent = 'No public repositories found.';
        return;
    }

    container.innerHTML = repos.map(repo => `
        <div class="card repo-card" data-repo="${repo.name}">
            <div class="repo-header">
                <h3>
                    <a href="#" onclick="loadRepoReadme('${repo.name}', '${repo.default_branch || 'main'}'); return false;">
                        ${repo.name}
                    </a>
                </h3>
                <div class="repo-stats">
                    <span>⭐ ${repo.stargazers_count}</span>
                    ${repo.language ? `<span>${repo.language}</span>` : ''}
                </div>
            </div>
            
            <p class="repo-description">${repo.description || 'No description available'}</p>
            
            ${repo.topics && repo.topics.length > 0 ? `
                <div class="repo-topics">
                    ${repo.topics.slice(0, 3).map(topic => `<span class="topic-tag">${topic}</span>`).join('')}
                    ${repo.topics.length > 3 ? `<span class="topic-tag">+${repo.topics.length - 3} more</span>` : ''}
                </div>
            ` : ''}
            
            <div class="repo-actions">
                <a href="#" onclick="loadRepoReadme('${repo.name}', '${repo.default_branch || 'main'}'); return false;" class="view-docs">
                    📖 View Documentation
                </a>
                <a href="${repo.html_url}" target="_blank" class="view-github">
                    GitHub →
                </a>
            </div>
            
            <div class="repo-readme" id="readme-${repo.name}" style="display: none;">
                <div class="readme-loading">Loading documentation...</div>
            </div>
        </div>
    `).join('');

    loading.style.display = 'none';
    container.style.display = 'grid';
}

async function loadRepoReadme(repoName, branch = 'main') {
    const readmeContainer = document.getElementById(`readme-${repoName}`);
    const isVisible = readmeContainer.style.display !== 'none';
    
    // Toggle visibility
    if (isVisible) {
        readmeContainer.style.display = 'none';
        return;
    }
    
    readmeContainer.style.display = 'block';
    readmeContainer.innerHTML = '<div class="readme-loading">🔄 Loading documentation...</div>';
    
    try {
        // Try main branch first, then master as fallback
        let readmeUrl = `https://raw.githubusercontent.com/Seigr-lab/${repoName}/${branch}/README.md`;
        let response = await fetch(readmeUrl);
        
        if (!response.ok && branch === 'main') {
            readmeUrl = `https://raw.githubusercontent.com/Seigr-lab/${repoName}/master/README.md`;
            response = await fetch(readmeUrl);
        }
        
        if (!response.ok) {
            throw new Error('README not found');
        }
        
        const markdown = await response.text();
        const html = convertMarkdownToHtml(markdown);
        
        readmeContainer.innerHTML = `
            <div class="readme-header">
                <h4>📋 Documentation</h4>
                <span class="live-indicator">Live from GitHub</span>
            </div>
            <div class="readme-content">${html}</div>
        `;
        
    } catch (error) {
        readmeContainer.innerHTML = `
            <div class="readme-header">
                <h4>📋 Documentation</h4>
            </div>
            <div class="readme-error">
                <p>📝 Work In Progress</p>
                <p><a href="https://github.com/Seigr-lab/${repoName}" target="_blank">View repository on GitHub</a></p>
            </div>
        `;
    }
}

function convertMarkdownToHtml(markdown) {
    // Simple markdown to HTML converter for basic elements
    let html = markdown
        // Headers
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        
        // Bold and italic
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        
        // Links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
        
        // Code blocks
        .replace(/```[\s\S]*?```/g, match => {
            const code = match.slice(3, -3).trim();
            return `<pre><code>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
        })
        
        // Inline code
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        
        // Line breaks
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>');
    
    return `<p>${html}</p>`;
}

// Load repositories when page loads (only on pages that have the repos container)
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('repos-container')) {
        loadRepositories();
    }
});