// Support/Donation Modal for Seigr.net
// Pure JavaScript - GitHub Pages compatible

const PAYMENT_OPTIONS = {
    github: {
        name: 'GitHub Sponsors',
        icon: '💙',
        url: 'https://github.com/sponsors/Seigr-lab',
        description: 'Support via GitHub Sponsors'
    },
    ethereum: {
        name: 'Ethereum (ETH)',
        icon: '⟠',
        address: '0x6E1dD6E9772F0230aF7533B875Ae975C65fBD593',
        description: 'Send ETH directly to our wallet'
    },
    polygon: {
        name: 'Polygon (MATIC)',
        icon: '⬡',
        address: '0x6E1dD6E9772F0230aF7533B875Ae975C65fBD593',
        description: 'Send MATIC on Polygon network'
    },
    bitcoin: {
        name: 'Bitcoin (BTC)',
        icon: '₿',
        address: 'bc1qj8lfhnuwdmnjaxfw6jd3p70ugjz4n4tg7ewzzw',
        description: 'Send Bitcoin to our wallet'
    },
    paypal: {
        name: 'PayPal',
        icon: '💳',
        url: 'https://paypal.me/sergism',
        description: 'Support via PayPal'
    }
};

function createSupportModal() {
    const modalHTML = `
        <div id="support-modal" class="support-modal" style="display: none;">
            <div class="support-modal-overlay" onclick="closeSupportModal()"></div>
            <div class="support-modal-content">
                <div class="support-modal-header">
                    <h2>Support Seigr</h2>
                    <button class="support-modal-close" onclick="closeSupportModal()">&times;</button>
                </div>
                
                <div class="support-modal-body">
                    <p class="support-intro">Help us build technology in harmony with life. Choose your preferred method:</p>
                    
                    <div class="payment-options">
                        ${Object.entries(PAYMENT_OPTIONS).map(([key, option]) => {
                            if (option.url) {
                                return `
                                    <div class="payment-option" onclick="openPaymentLink('${option.url}')">
                                        <div class="payment-icon">${option.icon}</div>
                                        <div class="payment-details">
                                            <div class="payment-name">${option.name}</div>
                                            <div class="payment-description">${option.description}</div>
                                        </div>
                                        <div class="payment-action">→</div>
                                    </div>
                                `;
                            } else {
                                return `
                                    <div class="payment-option crypto" onclick="showCryptoAddress('${key}')">
                                        <div class="payment-icon">${option.icon}</div>
                                        <div class="payment-details">
                                            <div class="payment-name">${option.name}</div>
                                            <div class="payment-description">${option.description}</div>
                                        </div>
                                        <div class="payment-action">📋</div>
                                    </div>
                                    <div id="crypto-${key}" class="crypto-address" style="display: none;">
                                        <input type="text" value="${option.address}" readonly id="address-${key}">
                                        <button onclick="copyCryptoAddress('${key}')" class="copy-btn">Copy Address</button>
                                        <div id="copied-${key}" class="copied-notification" style="display: none;">✓ Copied!</div>
                                    </div>
                                `;
                            }
                        }).join('')}
                    </div>
                    
                    <div class="support-footer">
                        <p>Every contribution helps us continue developing open-source, decentralized technologies. Thank you! 🙏</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    return modalHTML;
}

function openSupportModal() {
    const modal = document.getElementById('support-modal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

function closeSupportModal() {
    const modal = document.getElementById('support-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
        
        // Hide all open crypto addresses
        document.querySelectorAll('.crypto-address').forEach(el => {
            el.style.display = 'none';
        });
    }
}

function openPaymentLink(url) {
    window.open(url, '_blank', 'noopener,noreferrer');
}

function showCryptoAddress(type) {
    const addressDiv = document.getElementById(`crypto-${type}`);
    if (addressDiv) {
        const isVisible = addressDiv.style.display !== 'none';
        
        // Hide all other crypto addresses first
        document.querySelectorAll('.crypto-address').forEach(el => {
            el.style.display = 'none';
        });
        
        // Toggle current one
        addressDiv.style.display = isVisible ? 'none' : 'block';
    }
}

function copyCryptoAddress(type) {
    const input = document.getElementById(`address-${type}`);
    const notification = document.getElementById(`copied-${type}`);
    
    if (input) {
        // Select and copy
        input.select();
        input.setSelectionRange(0, 99999); // For mobile
        
        try {
            document.execCommand('copy');
            
            // Show copied notification
            if (notification) {
                notification.style.display = 'block';
                setTimeout(() => {
                    notification.style.display = 'none';
                }, 2000);
            }
        } catch (err) {
            console.error('Failed to copy:', err);
            
            // Fallback: try modern clipboard API
            if (navigator.clipboard) {
                navigator.clipboard.writeText(input.value).then(() => {
                    if (notification) {
                        notification.style.display = 'block';
                        setTimeout(() => {
                            notification.style.display = 'none';
                        }, 2000);
                    }
                });
            }
        }
    }
}

// Initialize support modal when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Create and inject the modal
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = createSupportModal();
    document.body.appendChild(modalContainer.firstElementChild);
});

// Close modal on ESC key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeSupportModal();
    }
});
