// Authentication functionality
let currentUser = null;
let isAuthModalOpen = false;

// Initialize authentication
function initializeAuth() {
    // Check for saved user session
    const savedUser = localStorage.getItem('fleurUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateAuthUI();
    }
}

// Show authentication modal
function showAuth(mode = 'login') {
    const authModal = document.getElementById('auth-modal');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    // Show modal
    authModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    isAuthModalOpen = true;
    
    // Switch to appropriate form
    if (mode === 'login') {
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
    } else {
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
    }
}

// Close authentication modal
function closeAuth() {
    const authModal = document.getElementById('auth-modal');
    authModal.classList.remove('active');
    document.body.style.overflow = '';
    isAuthModalOpen = false;
    
    // Clear form data
    clearAuthForms();
}

// Switch between auth forms
function switchAuth(mode) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (mode === 'login') {
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
    } else {
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
    }
    
    clearAuthForms();
}

// Handle login
function handleLogin(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const email = formData.get('email') || event.target.querySelector('input[type="email"]').value;
    const password = formData.get('password') || event.target.querySelector('input[type="password"]').value;
    
    // Validate inputs
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const restoreBtn = addLoadingState(submitBtn, 'Signing in...');
    
    // Simulate login process
    setTimeout(() => {
        // Check against saved users or simulate authentication
        const savedUsers = JSON.parse(localStorage.getItem('fleurUsers') || '[]');
        const user = savedUsers.find(u => u.email === email);
        
        if (user && user.password === password) {
            // Successful login
            currentUser = {
                id: user.id,
                name: user.name,
                email: user.email,
                loginTime: Date.now()
            };
            
            saveUserSession();
            updateAuthUI();
            closeAuth();
            showNotification(`Welcome back, ${user.name}!`, 'success');
            
        } else {
            // For demo purposes, allow any email/password combination
            currentUser = {
                id: 'demo-' + Date.now(),
                name: email.split('@')[0],
                email: email,
                loginTime: Date.now()
            };
            
            saveUserSession();
            updateAuthUI();
            closeAuth();
            showNotification(`Welcome, ${currentUser.name}!`, 'success');
        }
        
        restoreBtn();
    }, 1500);
}

// Handle registration
function handleRegister(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const name = formData.get('name') || event.target.querySelector('input[type="text"]').value;
    const email = formData.get('email') || event.target.querySelector('input[type="email"]').value;
    const password = formData.get('password') || event.target.querySelector('input[type="password"]').value;
    
    // Validate inputs
    if (!name || !email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const restoreBtn = addLoadingState(submitBtn, 'Creating account...');
    
    // Simulate registration process
    setTimeout(() => {
        // Check if user already exists
        const savedUsers = JSON.parse(localStorage.getItem('fleurUsers') || '[]');
        const existingUser = savedUsers.find(u => u.email === email);
        
        if (existingUser) {
            showNotification('An account with this email already exists', 'error');
            restoreBtn();
            return;
        }
        
        // Create new user
        const newUser = {
            id: 'user-' + Date.now(),
            name: name,
            email: email,
            password: password, // In production, this should be hashed
            createdAt: Date.now()
        };
        
        // Save user
        savedUsers.push(newUser);
        localStorage.setItem('fleurUsers', JSON.stringify(savedUsers));
        
        // Log in the new user
        currentUser = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            loginTime: Date.now()
        };
        
        saveUserSession();
        updateAuthUI();
        closeAuth();
        showNotification(`Welcome to Fleur, ${name}!`, 'success');
        
        restoreBtn();
    }, 1500);
}

// Handle logout
function handleLogout() {
    if (confirm('Are you sure you want to sign out?')) {
        currentUser = null;
        localStorage.removeItem('fleurUser');
        updateAuthUI();
        showNotification('You have been signed out', 'info');
    }
}

// Save user session
function saveUserSession() {
    if (currentUser) {
        localStorage.setItem('fleurUser', JSON.stringify(currentUser));
    }
}

// Update authentication UI
function updateAuthUI() {
    const userDropdown = document.getElementById('user-dropdown');
    
    if (currentUser) {
        // User is logged in
        userDropdown.innerHTML = `
            <div class="user-info">
                <span class="user-name">${currentUser.name}</span>
                <span class="user-email">${currentUser.email}</span>
            </div>
            <a href="#" onclick="showUserDashboard()">Dashboard</a>
            <a href="#" onclick="showOrderHistory()">Order History</a>
            <a href="#" onclick="showWishlist()">Wishlist</a>
            <a href="#" onclick="handleLogout()">Sign Out</a>
        `;
    } else {
        // User is not logged in
        userDropdown.innerHTML = `
            <a href="#" onclick="showAuth('login')">Sign In</a>
            <a href="#" onclick="showAuth('register')">Register</a>
        `;
    }
}

// Show user dashboard
function showUserDashboard() {
    if (!currentUser) {
        showAuth('login');
        return;
    }
    
    const orders = JSON.parse(localStorage.getItem('fleurOrders') || '[]');
    const userOrders = orders.filter(order => order.userId === currentUser.id);
    
    const dashboardContent = `
        <div class="user-dashboard">
            <h2>Welcome, ${currentUser.name}</h2>
            <div class="dashboard-stats">
                <div class="stat">
                    <span class="stat-number">${userOrders.length}</span>
                    <span class="stat-label">Total Orders</span>
                </div>
                <div class="stat">
                    <span class="stat-number">${wishlist.length}</span>
                    <span class="stat-label">Wishlist Items</span>
                </div>
                <div class="stat">
                    <span class="stat-number">${getCartItemCount()}</span>
                    <span class="stat-label">Cart Items</span>
                </div>
            </div>
        </div>
    `;
    
    showNotification(dashboardContent, 'info');
}

// Show order history
function showOrderHistory() {
    if (!currentUser) {
        showAuth('login');
        return;
    }
    
    const orders = JSON.parse(localStorage.getItem('fleurOrders') || '[]');
    const userOrders = orders.filter(order => order.userId === currentUser.id || !order.userId);
    
    if (userOrders.length === 0) {
        showNotification('No orders found. Start your chocolate journey!', 'info');
        return;
    }
    
    const ordersList = userOrders.map(order => `
        <div class="order-item">
            <h4>Order #${order.id.substr(-8)}</h4>
            <p>Date: ${new Date(order.timestamp).toLocaleDateString()}</p>
            <p>Total: $${order.total.toFixed(2)}</p>
            <p>Status: ${order.status}</p>
        </div>
    `).join('');
    
    showNotification(`<div class="order-history"><h3>Your Orders</h3>${ordersList}</div>`, 'info');
}

// Show wishlist
function showWishlist() {
    if (wishlist.length === 0) {
        showNotification('Your wishlist is empty. Add some items!', 'info');
        return;
    }
    
    const wishlistItems = wishlist.map(item => `
        <div class="wishlist-item">
            <span>${item.name}</span>
            <button onclick="addToCart(${item.id}); removeFromWishlist(${item.id})">Add to Cart</button>
        </div>
    `).join('');
    
    showNotification(`<div class="wishlist"><h3>Your Wishlist</h3>${wishlistItems}</div>`, 'info');
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Clear authentication forms
function clearAuthForms() {
    const forms = document.querySelectorAll('#auth-modal form');
    forms.forEach(form => {
        form.reset();
        // Reset floating labels
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            input.classList.remove('valid');
        });
    });
}

// Enhanced form validation
function setupFormValidation() {
    const authInputs = document.querySelectorAll('#auth-modal input');
    
    authInputs.forEach(input => {
        // Add real-time validation
        input.addEventListener('input', () => {
            validateInput(input);
        });
        
        input.addEventListener('blur', () => {
            validateInput(input);
        });
    });
}

// Validate individual input
function validateInput(input) {
    const value = input.value.trim();
    const type = input.type;
    let isValid = true;
    let message = '';
    
    // Remove existing validation classes
    input.classList.remove('valid', 'invalid');
    
    if (value === '') {
        // Empty field
        isValid = false;
        message = 'This field is required';
    } else if (type === 'email' && !isValidEmail(value)) {
        isValid = false;
        message = 'Please enter a valid email address';
    } else if (type === 'password' && value.length < 6) {
        isValid = false;
        message = 'Password must be at least 6 characters';
    } else {
        isValid = true;
    }
    
    // Add validation class
    input.classList.add(isValid ? 'valid' : 'invalid');
    
    // Show/hide validation message
    let validationMsg = input.parentNode.querySelector('.validation-message');
    if (!validationMsg) {
        validationMsg = document.createElement('div');
        validationMsg.className = 'validation-message';
        input.parentNode.appendChild(validationMsg);
    }
    
    validationMsg.textContent = isValid ? '' : message;
    validationMsg.style.display = isValid ? 'none' : 'block';
    
    return isValid;
}

// Social login simulation
function handleSocialLogin(provider) {
    showNotification(`${provider} login coming soon!`, 'info');
}

// Password strength indicator
function updatePasswordStrength(password) {
    const strength = calculatePasswordStrength(password);
    const strengthIndicator = document.querySelector('.password-strength');
    
    if (strengthIndicator) {
        strengthIndicator.className = `password-strength strength-${strength.level}`;
        strengthIndicator.textContent = strength.text;
    }
}

// Calculate password strength
function calculatePasswordStrength(password) {
    let score = 0;
    
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    const levels = ['weak', 'fair', 'good', 'strong', 'excellent'];
    const texts = ['Weak', 'Fair', 'Good', 'Strong', 'Excellent'];
    
    return {
        level: levels[Math.min(score, 4)],
        text: texts[Math.min(score, 4)]
    };
}

// Remember me functionality
function handleRememberMe(checked) {
    localStorage.setItem('fleurRememberMe', checked);
}

// Guest checkout
function guestCheckout() {
    if (getCartItemCount() === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    closeAuth();
    checkout(); // Call the regular checkout function
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeAuth();
    setupFormValidation();
    
    // Close modal when clicking outside
    document.addEventListener('click', (e) => {
        const authModal = document.getElementById('auth-modal');
        if (e.target === authModal && isAuthModalOpen) {
            closeAuth();
        }
    });
    
    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isAuthModalOpen) {
            closeAuth();
        }
    });
});

// Export functions for global use
window.AuthApp = {
    showAuth,
    closeAuth,
    switchAuth,
    handleLogin,
    handleRegister,
    handleLogout,
    showUserDashboard,
    showOrderHistory,
    showWishlist,
    guestCheckout,
    handleSocialLogin
};