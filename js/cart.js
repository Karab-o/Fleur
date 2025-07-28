// Shopping cart functionality
let cart = [];
let isCartOpen = false;

// Initialize cart from localStorage
function initializeCart() {
    const savedCart = localStorage.getItem('fleurCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }
}

// Add product to cart
function addToCartWithProduct(product) {
    const existingItemIndex = cart.findIndex(item => 
        item.id === product.id || 
        (product.isCustom && item.id === product.id)
    );
    
    if (existingItemIndex > -1) {
        // Increase quantity if item already exists
        cart[existingItemIndex].quantity += 1;
    } else {
        // Add new item to cart
        cart.push({
            ...product,
            quantity: 1,
            addedAt: Date.now()
        });
    }
    
    saveCart();
    updateCartDisplay();
    animateCartIcon();
}

// Remove item from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    updateCartDisplay();
    
    // Show removal notification
    showNotification('Item removed from cart', 'info');
}

// Update item quantity
function updateQuantity(itemId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(itemId);
        return;
    }
    
    const itemIndex = cart.findIndex(item => item.id === itemId);
    if (itemIndex > -1) {
        cart[itemIndex].quantity = newQuantity;
        saveCart();
        updateCartDisplay();
    }
}

// Get cart total
function getCartTotal() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const discount = getPromoDiscount();
    const discountAmount = subtotal * (discount / 100);
    return Math.max(0, subtotal - discountAmount);
}

// Get cart subtotal (before discount)
function getCartSubtotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Get promo discount
function getPromoDiscount() {
    return parseInt(localStorage.getItem('promoDiscount') || '0');
}

// Get cart item count
function getCartItemCount() {
    return cart.reduce((total, item) => total + item.quantity, 0);
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('fleurCart', JSON.stringify(cart));
}

// Toggle cart panel
function toggleCart() {
    const cartPanel = document.getElementById('cart-panel');
    isCartOpen = !isCartOpen;
    
    if (isCartOpen) {
        cartPanel.classList.add('open');
        document.body.style.overflow = 'hidden';
        updateCartDisplay();
    } else {
        cartPanel.classList.remove('open');
        document.body.style.overflow = '';
    }
}

// Update cart display
function updateCartDisplay() {
    updateCartIcon();
    updateCartItems();
    updateCartTotal();
}

// Update cart icon
function updateCartIcon() {
    const cartCount = document.getElementById('cart-count');
    const itemCount = getCartItemCount();
    
    if (cartCount) {
        cartCount.textContent = itemCount;
        cartCount.style.display = itemCount > 0 ? 'flex' : 'none';
    }
}

// Update cart items
function updateCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <p>Your cart is empty</p>
                <p>Add some love to your collection</p>
            </div>
        `;
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map(item => createCartItemHTML(item)).join('');
}

// Create cart item HTML
function createCartItemHTML(item) {
    const imageStyle = item.image || 'linear-gradient(45deg, #3E2723, #8B3A3A)';
    
    return `
        <div class="cart-item" data-item-id="${item.id}">
            <div class="cart-item-image" style="background: ${imageStyle}"></div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart('${item.id}')" title="Remove item">
                ×
            </button>
        </div>
    `;
}

// Update cart total
function updateCartTotal() {
    const cartTotalElement = document.getElementById('cart-total');
    if (!cartTotalElement) return;
    
    const subtotal = getCartSubtotal();
    const discount = getPromoDiscount();
    const total = getCartTotal();
    
    cartTotalElement.innerHTML = `
        ${discount > 0 ? `
            <div class="cart-subtotal">Subtotal: $${subtotal.toFixed(2)}</div>
            <div class="cart-discount">Discount (${discount}%): -$${(subtotal * discount / 100).toFixed(2)}</div>
            <div class="cart-final-total">Total: $${total.toFixed(2)}</div>
        ` : `${total.toFixed(2)}`}
    `;
}

// Animate cart icon when item is added
function animateCartIcon() {
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.style.transform = 'scale(1.2)';
        cartIcon.style.transition = 'transform 0.2s ease';
        
        setTimeout(() => {
            cartIcon.style.transform = 'scale(1)';
        }, 200);
    }
}

// Checkout process
function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    // Show loading state
    const checkoutBtn = document.querySelector('.checkout-btn');
    const restoreBtn = addLoadingState(checkoutBtn, 'Processing...');
    
    // Simulate checkout process
    setTimeout(() => {
        // Create order
        const order = {
            id: 'order-' + Date.now(),
            items: [...cart],
            total: getCartTotal(),
            discount: getPromoDiscount(),
            timestamp: Date.now(),
            status: 'confirmed'
        };
        
        // Save order to localStorage
        saveOrder(order);
        
        // Clear cart
        cart = [];
        saveCart();
        localStorage.removeItem('promoDiscount');
        
        // Show success
        showCheckoutSuccess(order);
        
        // Update display
        updateCartDisplay();
        
        // Close cart
        toggleCart();
        
        // Restore button
        restoreBtn();
        
        // Show confetti
        showConfetti();
        
    }, 2000);
}

// Save order
function saveOrder(order) {
    const orders = JSON.parse(localStorage.getItem('fleurOrders') || '[]');
    orders.push(order);
    localStorage.setItem('fleurOrders', JSON.stringify(orders));
}

// Show checkout success
function showCheckoutSuccess(order) {
    const successMessage = `
        <div style="text-align: center; margin-bottom: 1rem;">
            <h3>Order Confirmed! 🍫</h3>
            <p>Order #${order.id.substr(-8)}</p>
            <p>Total: $${order.total.toFixed(2)}</p>
        </div>
        <p>Thank you for your order! Your chocolate journey will begin soon.</p>
    `;
    
    showNotification(successMessage, 'success');
}

// Show confetti animation
function showConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti';
    document.body.appendChild(confettiContainer);
    
    // Create confetti pieces
    for (let i = 0; i < 50; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.animationDelay = Math.random() * 3 + 's';
        piece.style.animationDuration = (Math.random() * 2 + 2) + 's';
        confettiContainer.appendChild(piece);
    }
    
    // Remove confetti after animation
    setTimeout(() => {
        confettiContainer.remove();
    }, 5000);
}

// Clear cart
function clearCart() {
    if (cart.length === 0) return;
    
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        saveCart();
        updateCartDisplay();
        showNotification('Cart cleared', 'info');
    }
}

// Get cart summary for display
function getCartSummary() {
    return {
        itemCount: getCartItemCount(),
        total: getCartTotal(),
        subtotal: getCartSubtotal(),
        discount: getPromoDiscount(),
        items: cart
    };
}

// Apply promo code (used by main.js)
window.updateCartDisplay = updateCartDisplay;

// Quick add to cart with animation
function quickAddToCart(productId) {
    const product = productsData.find(p => p.id === productId);
    if (product) {
        addToCartWithProduct(product);
        
        // Create flying animation to cart
        createFlyToCartAnimation(event.target);
    }
}

// Create fly to cart animation
function createFlyToCartAnimation(sourceElement) {
    const cartIcon = document.querySelector('.cart-icon');
    const sourceRect = sourceElement.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();
    
    // Create flying element
    const flyingElement = document.createElement('div');
    flyingElement.innerHTML = '🍫';
    flyingElement.style.cssText = `
        position: fixed;
        left: ${sourceRect.left + sourceRect.width / 2}px;
        top: ${sourceRect.top + sourceRect.height / 2}px;
        font-size: 1.5rem;
        pointer-events: none;
        z-index: 1000;
        transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    `;
    
    document.body.appendChild(flyingElement);
    
    // Animate to cart
    setTimeout(() => {
        flyingElement.style.left = cartRect.left + cartRect.width / 2 + 'px';
        flyingElement.style.top = cartRect.top + cartRect.height / 2 + 'px';
        flyingElement.style.transform = 'scale(0.3)';
        flyingElement.style.opacity = '0';
    }, 50);
    
    // Remove element after animation
    setTimeout(() => {
        flyingElement.remove();
        animateCartIcon();
    }, 800);
}

// Wishlist functionality
let wishlist = [];

function addToWishlist(productId) {
    const product = productsData.find(p => p.id === productId);
    if (product && !wishlist.find(item => item.id === productId)) {
        wishlist.push(product);
        localStorage.setItem('fleurWishlist', JSON.stringify(wishlist));
        showNotification(`${product.name} added to wishlist!`, 'success');
    }
}

function removeFromWishlist(productId) {
    wishlist = wishlist.filter(item => item.id !== productId);
    localStorage.setItem('fleurWishlist', JSON.stringify(wishlist));
    showNotification('Item removed from wishlist', 'info');
}

// Load wishlist from localStorage
function loadWishlist() {
    const savedWishlist = localStorage.getItem('fleurWishlist');
    if (savedWishlist) {
        wishlist = JSON.parse(savedWishlist);
    }
}

// Cart persistence across sessions
function restoreCartOnPageLoad() {
    initializeCart();
    loadWishlist();
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    restoreCartOnPageLoad();
    
    // Close cart when clicking outside
    document.addEventListener('click', (e) => {
        const cartPanel = document.getElementById('cart-panel');
        const cartIcon = document.querySelector('.cart-icon');
        
        if (isCartOpen && !cartPanel.contains(e.target) && !cartIcon.contains(e.target)) {
            toggleCart();
        }
    });
    
    // Handle escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isCartOpen) {
            toggleCart();
        }
    });
});

// Auto-save cart periodically
setInterval(() => {
    if (cart.length > 0) {
        saveCart();
    }
}, 30000); // Save every 30 seconds

// Export functions for global use
window.CartApp = {
    addToCartWithProduct,
    removeFromCart,
    updateQuantity,
    toggleCart,
    checkout,
    clearCart,
    getCartSummary,
    addToWishlist,
    removeFromWishlist,
    quickAddToCart
};