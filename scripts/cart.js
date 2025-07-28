// Shopping Cart functionality

// Cart state
let cartItems = [];
let cartTotal = 0;
let promoCode = null;
let promoDiscount = 0;

// Promo codes
const promoCodes = {
    'LOVE10': { discount: 10, type: 'percentage', description: '10% off your order' },
    'FIRST15': { discount: 15, type: 'percentage', description: '15% off for new customers' },
    'SWEET5': { discount: 5, type: 'fixed', description: '$5 off your order' },
    'MYSTERY20': { discount: 20, type: 'percentage', description: '20% off mystery collection' }
};

// Initialize cart
document.addEventListener('DOMContentLoaded', function() {
    initializeCart();
});

function initializeCart() {
    // Load cart from localStorage
    loadCartFromStorage();
    
    // Setup cart event listeners
    setupCartEventListeners();
    
    // Update cart display
    updateCartDisplay();
    
    // Setup promo code functionality
    setupPromoCode();
}

function setupCartEventListeners() {
    // Cart icon click
    const cartIcon = document.getElementById('cartIcon');
    if (cartIcon) {
        cartIcon.addEventListener('click', openCartModal);
    }
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }
}

function setupPromoCode() {
    const promoInput = document.getElementById('promoInput');
    const applyPromoBtn = document.getElementById('applyPromo');
    
    if (applyPromoBtn) {
        applyPromoBtn.addEventListener('click', applyPromoCode);
    }
    
    if (promoInput) {
        promoInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                applyPromoCode();
            }
        });
    }
}

// Cart management functions
function addItem(product, quantity = 1) {
    // Check if item already exists in cart
    const existingItemIndex = cartItems.findIndex(item => 
        item.id === product.id || (product.custom && item.custom && item.id === product.id)
    );
    
    if (existingItemIndex !== -1) {
        // Update quantity if item exists
        cartItems[existingItemIndex].quantity += quantity;
    } else {
        // Add new item to cart
        const cartItem = {
            ...product,
            quantity: quantity,
            addedAt: new Date().toISOString()
        };
        cartItems.push(cartItem);
    }
    
    // Update cart display and save to storage
    updateCartDisplay();
    saveCartToStorage();
    
    // Show notification
    window.chocolateBar.showNotification(
        `Added ${product.name} to cart!`, 
        'success'
    );
    
    // Add cart animation
    animateCartIcon();
}

function removeItem(itemId) {
    cartItems = cartItems.filter(item => item.id !== itemId);
    updateCartDisplay();
    saveCartToStorage();
    
    window.chocolateBar.showNotification('Item removed from cart', 'info');
}

function updateItemQuantity(itemId, newQuantity) {
    if (newQuantity <= 0) {
        removeItem(itemId);
        return;
    }
    
    const itemIndex = cartItems.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
        cartItems[itemIndex].quantity = newQuantity;
        updateCartDisplay();
        saveCartToStorage();
    }
}

function clearCart() {
    cartItems = [];
    promoCode = null;
    promoDiscount = 0;
    updateCartDisplay();
    saveCartToStorage();
    
    window.chocolateBar.showNotification('Cart cleared', 'info');
}

// Cart display functions
function updateCartDisplay() {
    updateCartCount();
    updateCartTotal();
    renderCartItems();
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Show/hide cart count badge
        if (totalItems > 0) {
            cartCount.style.display = 'flex';
        } else {
            cartCount.style.display = 'none';
        }
    }
}

function updateCartTotal() {
    // Calculate subtotal
    const subtotal = cartItems.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
    }, 0);
    
    // Apply promo discount
    let discount = 0;
    if (promoCode && promoCodes[promoCode]) {
        const promo = promoCodes[promoCode];
        if (promo.type === 'percentage') {
            discount = subtotal * (promo.discount / 100);
        } else if (promo.type === 'fixed') {
            discount = Math.min(promo.discount, subtotal);
        }
    }
    
    cartTotal = Math.max(0, subtotal - discount);
    promoDiscount = discount;
    
    // Update display
    const cartTotalElement = document.getElementById('cartTotal');
    if (cartTotalElement) {
        cartTotalElement.textContent = cartTotal.toFixed(2);
    }
}

function renderCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    if (!cartItemsContainer) return;
    
    cartItemsContainer.innerHTML = '';
    
    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-bag"></i>
                <p>Your cart is empty</p>
                <p>Discover our collection of handcrafted chocolate bars</p>
            </div>
        `;
        return;
    }
    
    cartItems.forEach(item => {
        const cartItemElement = createCartItemElement(item);
        cartItemsContainer.appendChild(cartItemElement);
    });
    
    // Add promo code section if items exist
    if (cartItems.length > 0) {
        const promoSection = createPromoSection();
        cartItemsContainer.appendChild(promoSection);
    }
}

function createCartItemElement(item) {
    const itemElement = document.createElement('div');
    itemElement.className = 'cart-item';
    itemElement.setAttribute('data-item-id', item.id);
    
    const itemTotal = (item.price * item.quantity).toFixed(2);
    
    itemElement.innerHTML = `
        <div class="cart-item-image" style="background: ${item.custom ? 'linear-gradient(45deg, var(--dark-chocolate), var(--burgundy-red))' : `linear-gradient(135deg, ${getProductGradient(item.emotion || 'mystery')})`}">
            ${item.custom ? '<i class="fas fa-palette"></i>' : ''}
        </div>
        <div class="cart-item-details">
            <h4 class="cart-item-name">${item.name}</h4>
            <p class="cart-item-description">${item.description}</p>
            ${item.custom ? '<span class="custom-badge">Custom Creation</span>' : ''}
            <div class="cart-item-price">$${item.price.toFixed(2)} each</div>
        </div>
        <div class="cart-item-controls">
            <div class="quantity-controls">
                <button class="qty-btn minus" onclick="updateItemQuantity('${item.id}', ${item.quantity - 1})">
                    <i class="fas fa-minus"></i>
                </button>
                <span class="quantity">${item.quantity}</span>
                <button class="qty-btn plus" onclick="updateItemQuantity('${item.id}', ${item.quantity + 1})">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            <div class="item-total">$${itemTotal}</div>
            <button class="remove-item-btn" onclick="removeItem('${item.id}')" title="Remove item">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    return itemElement;
}

function createPromoSection() {
    const promoSection = document.createElement('div');
    promoSection.className = 'cart-promo-section';
    
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    let promoDisplay = '';
    if (promoCode && promoDiscount > 0) {
        promoDisplay = `
            <div class="applied-promo">
                <span class="promo-code">${promoCode}</span>
                <span class="promo-discount">-$${promoDiscount.toFixed(2)}</span>
                <button class="remove-promo" onclick="removePromoCode()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    }
    
    promoSection.innerHTML = `
        <div class="cart-summary">
            <div class="summary-line">
                <span>Subtotal:</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            ${promoDisplay}
            ${promoDiscount > 0 ? `
                <div class="summary-line total">
                    <span>Total:</span>
                    <span>$${cartTotal.toFixed(2)}</span>
                </div>
            ` : ''}
        </div>
    `;
    
    return promoSection;
}

function getProductGradient(emotion) {
    const gradients = {
        nostalgia: '#795548, #8D6E63',
        joy: '#FF9800, #FFC107',
        calm: '#2196F3, #03A9F4',
        bold: '#F44336, #FF5722',
        comfort: '#E91E63, #9C27B0',
        mystery: '#3E2723, #5D4037'
    };
    return gradients[emotion] || '#722F37, #5A252A';
}

// Cart modal functions
function openCartModal() {
    window.chocolateBar.openModal('cartModal');
}

function closeCartModal() {
    window.chocolateBar.closeModal('cartModal');
}

// Promo code functions
function applyPromoCode() {
    const promoInput = document.getElementById('promoInput');
    if (!promoInput) return;
    
    const code = promoInput.value.trim().toUpperCase();
    
    if (!code) {
        window.chocolateBar.showNotification('Please enter a promo code', 'error');
        return;
    }
    
    if (promoCodes[code]) {
        promoCode = code;
        promoInput.value = '';
        updateCartDisplay();
        saveCartToStorage();
        
        const promo = promoCodes[code];
        window.chocolateBar.showNotification(
            `Promo code applied! ${promo.description}`, 
            'success'
        );
    } else {
        window.chocolateBar.showNotification('Invalid promo code', 'error');
    }
}

function removePromoCode() {
    promoCode = null;
    promoDiscount = 0;
    updateCartDisplay();
    saveCartToStorage();
    
    window.chocolateBar.showNotification('Promo code removed', 'info');
}

// Storage functions
function saveCartToStorage() {
    const cartData = {
        items: cartItems,
        promoCode: promoCode,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('chocolateBarCart', JSON.stringify(cartData));
}

function loadCartFromStorage() {
    const storedCart = localStorage.getItem('chocolateBarCart');
    
    if (storedCart) {
        try {
            const cartData = JSON.parse(storedCart);
            
            // Check if cart is not too old (24 hours)
            const cartAge = new Date() - new Date(cartData.timestamp);
            const maxAge = 24 * 60 * 60 * 1000; // 24 hours
            
            if (cartAge < maxAge) {
                cartItems = cartData.items || [];
                promoCode = cartData.promoCode || null;
            } else {
                // Clear old cart
                localStorage.removeItem('chocolateBarCart');
            }
        } catch (e) {
            console.error('Error loading cart from storage:', e);
            localStorage.removeItem('chocolateBarCart');
        }
    }
}

// Checkout functions
function handleCheckout() {
    if (cartItems.length === 0) {
        window.chocolateBar.showNotification('Your cart is empty', 'error');
        return;
    }
    
    // Simulate checkout process
    const checkoutBtn = document.getElementById('checkoutBtn');
    const originalText = checkoutBtn.textContent;
    
    checkoutBtn.textContent = 'Processing...';
    checkoutBtn.disabled = true;
    
    setTimeout(() => {
        // Simulate successful checkout
        showCheckoutSuccess();
        
        // Clear cart
        clearCart();
        
        // Close cart modal
        closeCartModal();
        
        // Reset button
        checkoutBtn.textContent = originalText;
        checkoutBtn.disabled = false;
    }, 2000);
}

function showCheckoutSuccess() {
    // Create success overlay
    const successOverlay = document.createElement('div');
    successOverlay.className = 'checkout-success-overlay';
    successOverlay.innerHTML = `
        <div class="success-content">
            <div class="success-icon">
                <i class="fas fa-heart"></i>
            </div>
            <h3>Thank You!</h3>
            <p>Your order has been placed with love</p>
            <p>You'll receive a confirmation email shortly</p>
            <button class="success-btn" onclick="closeCheckoutSuccess()">Continue Shopping</button>
        </div>
    `;
    
    successOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 3000;
        backdrop-filter: blur(5px);
    `;
    
    document.body.appendChild(successOverlay);
    
    // Add confetti effect
    createConfetti();
}

function closeCheckoutSuccess() {
    const overlay = document.querySelector('.checkout-success-overlay');
    if (overlay) {
        overlay.remove();
    }
}

function createConfetti() {
    const colors = ['#722F37', '#4A5D23', '#D4AF37', '#F5F0E8'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            top: -10px;
            left: ${Math.random() * 100}vw;
            border-radius: 50%;
            z-index: 3001;
            pointer-events: none;
        `;
        
        document.body.appendChild(confetti);
        
        // Animate confetti
        const fallDuration = Math.random() * 3000 + 2000;
        const rotation = Math.random() * 360;
        
        confetti.animate([
            { 
                transform: `translateY(0px) rotate(0deg)`,
                opacity: 1
            },
            { 
                transform: `translateY(${window.innerHeight + 20}px) rotate(${rotation}deg)`,
                opacity: 0
            }
        ], {
            duration: fallDuration,
            easing: 'ease-in'
        }).onfinish = () => {
            confetti.remove();
        };
    }
}

// Animation functions
function animateCartIcon() {
    const cartIcon = document.getElementById('cartIcon');
    if (cartIcon) {
        cartIcon.style.transform = 'scale(1.2)';
        cartIcon.style.transition = 'transform 0.2s ease';
        
        setTimeout(() => {
            cartIcon.style.transform = 'scale(1)';
        }, 200);
    }
}

// Export cart functionality
window.cart = {
    items: cartItems,
    total: cartTotal,
    addItem: addItem,
    removeItem: removeItem,
    updateItemQuantity: updateItemQuantity,
    clearCart: clearCart,
    openModal: openCartModal,
    closeModal: closeCartModal,
    applyPromoCode: applyPromoCode,
    removePromoCode: removePromoCode
};

// Make functions available globally for onclick handlers
window.updateItemQuantity = updateItemQuantity;
window.removeItem = removeItem;
window.removePromoCode = removePromoCode;
window.closeCheckoutSuccess = closeCheckoutSuccess;