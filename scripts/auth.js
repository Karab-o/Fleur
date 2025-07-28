// Authentication functionality

// User management
let currentUser = null;

// Initialize authentication
document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
});

function initializeAuth() {
    setupAuthEventListeners();
    checkUserSession();
    setupFormValidation();
}

function setupAuthEventListeners() {
    // Login button
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            if (currentUser) {
                showUserMenu();
            } else {
                openAuthModal();
            }
        });
    }
    
    // Auth form switches
    const authSwitches = document.querySelectorAll('.auth-switch');
    authSwitches.forEach(switchBtn => {
        switchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const targetForm = this.getAttribute('data-form');
            switchAuthForm(targetForm);
        });
    });
    
    // Form submissions
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
}

function setupFormValidation() {
    // Real-time validation for auth forms
    const inputs = document.querySelectorAll('#authModal input');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

// Authentication functions
function openAuthModal() {
    window.chocolateBar.openModal('authModal');
    // Ensure login form is shown by default
    switchAuthForm('login');
}

function switchAuthForm(formType) {
    const loginForm = document.querySelector('.login-form');
    const signupForm = document.querySelector('.signup-form');
    
    if (formType === 'login') {
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
    } else if (formType === 'signup') {
        signupForm.classList.add('active');
        loginForm.classList.remove('active');
    }
    
    // Clear any existing errors
    clearAllFormErrors();
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Validate form
    if (!validateLoginForm(email, password)) {
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Signing in...';
    submitBtn.disabled = true;
    
    // Simulate login process
    setTimeout(() => {
        // Check credentials (in a real app, this would be an API call)
        if (authenticateUser(email, password)) {
            loginSuccess(email);
        } else {
            loginError();
        }
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    
    // Validate form
    if (!validateSignupForm(name, email, password)) {
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Creating account...';
    submitBtn.disabled = true;
    
    // Simulate signup process
    setTimeout(() => {
        // Check if user already exists
        if (userExists(email)) {
            showFieldError(document.getElementById('signupEmail'), 'An account with this email already exists');
        } else {
            signupSuccess(name, email);
        }
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

function authenticateUser(email, password) {
    // In a real application, this would validate against a backend
    // For demo purposes, we'll accept any email/password combination
    // except for some specific demo cases
    const demoUsers = {
        'demo@example.com': 'password123',
        'user@essenceoflove.com': 'chocolate',
        'test@test.com': 'test123'
    };
    
    return demoUsers[email] === password || password.length >= 6;
}

function userExists(email) {
    // Check if user exists in storage
    const existingUsers = JSON.parse(localStorage.getItem('chocolateBarUsers') || '[]');
    return existingUsers.some(user => user.email === email);
}

function loginSuccess(email) {
    // Get user data or create basic user object
    const existingUsers = JSON.parse(localStorage.getItem('chocolateBarUsers') || '[]');
    let user = existingUsers.find(u => u.email === email);
    
    if (!user) {
        // Create basic user for demo login
        user = {
            id: Date.now(),
            name: email.split('@')[0].replace(/\./g, ' '),
            email: email,
            joinDate: new Date().toISOString(),
            preferences: {
                favoriteEmotions: [],
                preferredChocolate: 'dark'
            }
        };
    }
    
    currentUser = user;
    saveUserSession();
    updateAuthButton();
    
    window.chocolateBar.closeModal('authModal');
    window.chocolateBar.showNotification(`Welcome back, ${user.name}!`, 'success');
    
    // Clear form
    document.getElementById('loginForm').reset();
}

function signupSuccess(name, email) {
    // Create new user
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        joinDate: new Date().toISOString(),
        preferences: {
            favoriteEmotions: [],
            preferredChocolate: 'dark'
        },
        orders: []
    };
    
    // Save user to storage
    const existingUsers = JSON.parse(localStorage.getItem('chocolateBarUsers') || '[]');
    existingUsers.push(newUser);
    localStorage.setItem('chocolateBarUsers', JSON.stringify(existingUsers));
    
    currentUser = newUser;
    saveUserSession();
    updateAuthButton();
    
    window.chocolateBar.closeModal('authModal');
    window.chocolateBar.showNotification(`Welcome to our family, ${name}!`, 'success');
    
    // Clear form
    document.getElementById('signupForm').reset();
}

function loginError() {
    window.chocolateBar.showNotification('Invalid email or password', 'error');
}

function logout() {
    currentUser = null;
    localStorage.removeItem('chocolateBarUser');
    updateAuthButton();
    window.chocolateBar.showNotification('You have been logged out', 'info');
}

// User session management
function saveUserSession() {
    if (currentUser) {
        localStorage.setItem('chocolateBarUser', JSON.stringify(currentUser));
    }
}

function checkUserSession() {
    const storedUser = localStorage.getItem('chocolateBarUser');
    if (storedUser) {
        try {
            currentUser = JSON.parse(storedUser);
            updateAuthButton();
        } catch (e) {
            localStorage.removeItem('chocolateBarUser');
        }
    }
}

function updateAuthButton() {
    const authBtn = document.getElementById('loginBtn');
    if (authBtn) {
        if (currentUser) {
            authBtn.textContent = `Hi, ${currentUser.name.split(' ')[0]}`;
            authBtn.style.background = 'var(--army-green)';
        } else {
            authBtn.textContent = 'Sign In';
            authBtn.style.background = 'var(--burgundy-red)';
        }
    }
}

function showUserMenu() {
    // Create user menu dropdown
    const existingMenu = document.querySelector('.user-menu');
    if (existingMenu) {
        existingMenu.remove();
        return;
    }
    
    const userMenu = document.createElement('div');
    userMenu.className = 'user-menu';
    userMenu.innerHTML = `
        <div class="user-menu-content">
            <div class="user-info">
                <h4>${currentUser.name}</h4>
                <p>${currentUser.email}</p>
            </div>
            <div class="user-menu-links">
                <a href="#" onclick="showUserProfile()">
                    <i class="fas fa-user"></i> Profile
                </a>
                <a href="#" onclick="showOrderHistory()">
                    <i class="fas fa-history"></i> Order History
                </a>
                <a href="#" onclick="showUserPreferences()">
                    <i class="fas fa-heart"></i> Preferences
                </a>
                <a href="#" onclick="logout()" class="logout-link">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </a>
            </div>
        </div>
    `;
    
    userMenu.style.cssText = `
        position: absolute;
        top: 70px;
        right: 20px;
        background: var(--cream-white);
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        padding: 1.5rem;
        min-width: 250px;
        z-index: 1500;
        border: 1px solid var(--warm-beige);
    `;
    
    document.body.appendChild(userMenu);
    
    // Close menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeUserMenu(e) {
            if (!userMenu.contains(e.target) && !document.getElementById('loginBtn').contains(e.target)) {
                userMenu.remove();
                document.removeEventListener('click', closeUserMenu);
            }
        });
    }, 100);
}

// Form validation
function validateLoginForm(email, password) {
    let isValid = true;
    
    if (!email) {
        showFieldError(document.getElementById('loginEmail'), 'Email is required');
        isValid = false;
    } else if (!validateEmail(email)) {
        showFieldError(document.getElementById('loginEmail'), 'Please enter a valid email');
        isValid = false;
    }
    
    if (!password) {
        showFieldError(document.getElementById('loginPassword'), 'Password is required');
        isValid = false;
    }
    
    return isValid;
}

function validateSignupForm(name, email, password) {
    let isValid = true;
    
    if (!name) {
        showFieldError(document.getElementById('signupName'), 'Name is required');
        isValid = false;
    } else if (name.length < 2) {
        showFieldError(document.getElementById('signupName'), 'Name must be at least 2 characters');
        isValid = false;
    }
    
    if (!email) {
        showFieldError(document.getElementById('signupEmail'), 'Email is required');
        isValid = false;
    } else if (!validateEmail(email)) {
        showFieldError(document.getElementById('signupEmail'), 'Please enter a valid email');
        isValid = false;
    }
    
    if (!password) {
        showFieldError(document.getElementById('signupPassword'), 'Password is required');
        isValid = false;
    } else if (password.length < 6) {
        showFieldError(document.getElementById('signupPassword'), 'Password must be at least 6 characters');
        isValid = false;
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    clearFieldError(field);
    
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    if (field.type === 'email' && value && !validateEmail(value)) {
        showFieldError(field, 'Please enter a valid email');
        return false;
    }
    
    if (field.type === 'password' && value && value.length < 6) {
        showFieldError(field, 'Password must be at least 6 characters');
        return false;
    }
    
    return true;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: var(--burgundy-red);
        font-size: 0.8rem;
        margin-top: 0.25rem;
        animation: fadeIn 0.3s ease;
    `;
    
    field.parentNode.appendChild(errorElement);
    field.style.borderColor = 'var(--burgundy-red)';
}

function clearFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    field.style.borderColor = '';
}

function clearAllFormErrors() {
    const errors = document.querySelectorAll('.field-error');
    errors.forEach(error => error.remove());
    
    const inputs = document.querySelectorAll('#authModal input');
    inputs.forEach(input => {
        input.style.borderColor = '';
    });
}

// Contact form handling
function handleContactForm(e) {
    e.preventDefault();
    
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const messageType = document.getElementById('messageType').value;
    const message = document.getElementById('contactMessage').value.trim();
    
    // Validate form
    if (!window.chocolateBar.validateForm(e.target)) {
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        // Create contact entry
        const contactEntry = {
            id: Date.now(),
            name: name,
            email: email,
            messageType: messageType,
            message: message,
            timestamp: new Date().toISOString(),
            status: 'received'
        };
        
        // Save to localStorage (in real app, would send to backend)
        const contacts = JSON.parse(localStorage.getItem('chocolateBarContacts') || '[]');
        contacts.push(contactEntry);
        localStorage.setItem('chocolateBarContacts', JSON.stringify(contacts));
        
        // Show success message
        showContactSuccess();
        
        // Clear form
        e.target.reset();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

function showContactSuccess() {
    // Create thank you message
    const thankYouMessage = document.createElement('div');
    thankYouMessage.className = 'contact-thank-you';
    thankYouMessage.innerHTML = `
        <div class="thank-you-content">
            <i class="fas fa-envelope-open-text"></i>
            <h3>Thank You!</h3>
            <p>Your message has been sent with love. We'll get back to you soon.</p>
        </div>
    `;
    
    thankYouMessage.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--cream-white);
        padding: 3rem;
        border-radius: 12px;
        box-shadow: 0 20px 50px rgba(0,0,0,0.3);
        text-align: center;
        z-index: 3000;
        max-width: 400px;
        animation: slideInUp 0.5s ease;
    `;
    
    document.body.appendChild(thankYouMessage);
    
    // Remove after 3 seconds
    setTimeout(() => {
        thankYouMessage.style.animation = 'slideOutDown 0.5s ease';
        setTimeout(() => {
            if (thankYouMessage.parentNode) {
                thankYouMessage.parentNode.removeChild(thankYouMessage);
            }
        }, 500);
    }, 3000);
}

// User profile functions
function showUserProfile() {
    const userMenu = document.querySelector('.user-menu');
    if (userMenu) userMenu.remove();
    
    window.chocolateBar.showNotification('Profile feature coming soon!', 'info');
}

function showOrderHistory() {
    const userMenu = document.querySelector('.user-menu');
    if (userMenu) userMenu.remove();
    
    window.chocolateBar.showNotification('Order history feature coming soon!', 'info');
}

function showUserPreferences() {
    const userMenu = document.querySelector('.user-menu');
    if (userMenu) userMenu.remove();
    
    window.chocolateBar.showNotification('Preferences feature coming soon!', 'info');
}

// Export auth functionality
window.auth = {
    currentUser: () => currentUser,
    login: handleLogin,
    signup: handleSignup,
    logout: logout,
    openModal: openAuthModal,
    isLoggedIn: () => !!currentUser
};

// Global functions for onclick handlers
window.showUserProfile = showUserProfile;
window.showOrderHistory = showOrderHistory;
window.showUserPreferences = showUserPreferences;
window.logout = logout;