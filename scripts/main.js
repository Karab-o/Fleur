// Main JavaScript functionality for Essence of Love website

// DOM Elements
const loadingScreen = document.getElementById('loading-screen');
const welcomeSection = document.getElementById('welcome');
const mainContent = document.getElementById('main-content');
const enterBtn = document.getElementById('enterBtn');
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');

// State Management
let currentUser = null;
let isMainContentVisible = false;

// Initialize website
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

function initializeWebsite() {
    // Hide loading screen after 2 seconds
    setTimeout(() => {
        loadingScreen.classList.add('hide');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 800);
    }, 2000);

    // Initialize event listeners
    initializeEventListeners();
    
    // Initialize scroll effects
    initializeScrollEffects();
    
    // Initialize animations
    initializeAnimations();
    
    // Check for stored user session
    checkUserSession();
}

function initializeEventListeners() {
    // Welcome section enter button
    if (enterBtn) {
        enterBtn.addEventListener('click', enterMainContent);
    }

    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavigation);
    });

    // Hamburger menu
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }

    // Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                smoothScrollTo(target);
            }
        });
    });

    // Window resize handler
    window.addEventListener('resize', handleResize);
    
    // Scroll handler
    window.addEventListener('scroll', handleScroll);

    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });

    // Escape key to close modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

function enterMainContent() {
    welcomeSection.style.opacity = '0';
    welcomeSection.style.transform = 'translateY(-50px)';
    
    setTimeout(() => {
        welcomeSection.style.display = 'none';
        mainContent.classList.remove('hidden');
        mainContent.style.opacity = '1';
        isMainContentVisible = true;
        
        // Trigger entrance animations
        triggerEntranceAnimations();
    }, 800);
}

function triggerEntranceAnimations() {
    // Add stagger effect to elements
    const animatedElements = document.querySelectorAll('.hero-content > *');
    animatedElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

function handleNavigation(e) {
    e.preventDefault();
    
    // Remove active class from all links
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Add active class to clicked link
    e.target.classList.add('active');
    
    // Get target section
    const targetId = e.target.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
        smoothScrollTo(targetSection);
    }
    
    // Close mobile menu if open
    if (window.innerWidth <= 768) {
        closeMobileMenu();
    }
}

function smoothScrollTo(target) {
    const targetPosition = target.offsetTop - 80; // Account for fixed navbar
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        smoothScrollTo(section);
    }
}

function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Add mobile menu styles
    if (navMenu.classList.contains('active')) {
        navMenu.style.display = 'flex';
        navMenu.style.flexDirection = 'column';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '80px';
        navMenu.style.left = '0';
        navMenu.style.right = '0';
        navMenu.style.background = 'var(--cream-white)';
        navMenu.style.padding = '2rem';
        navMenu.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
    } else {
        closeMobileMenu();
    }
}

function closeMobileMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    
    if (window.innerWidth <= 768) {
        navMenu.style.display = 'none';
    } else {
        navMenu.style.display = 'flex';
        navMenu.style.flexDirection = 'row';
        navMenu.style.position = 'static';
        navMenu.style.background = 'transparent';
        navMenu.style.padding = '0';
        navMenu.style.boxShadow = 'none';
    }
}

function handleResize() {
    if (window.innerWidth > 768) {
        closeMobileMenu();
        navMenu.style.display = 'flex';
    } else {
        if (!navMenu.classList.contains('active')) {
            navMenu.style.display = 'none';
        }
    }
}

function handleScroll() {
    const scrollY = window.scrollY;
    
    // Navbar background change
    if (scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Update active navigation link based on scroll position
    updateActiveNavLink();
    
    // Parallax effects
    handleParallaxEffects(scrollY);
    
    // Scroll animations
    handleScrollAnimations();
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}

function handleParallaxEffects(scrollY) {
    // Hero section parallax
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
        heroVisual.style.transform = `translateY(${scrollY * 0.3}px)`;
    }
    
    // Floating particles
    const particles = document.querySelectorAll('.floating-particles');
    particles.forEach(particle => {
        particle.style.transform = `translateY(${scrollY * 0.1}px)`;
    });
}

function handleScrollAnimations() {
    const animatedElements = document.querySelectorAll('.timeline-item, .product-card, .gift-card');
    
    animatedElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('animate-in');
        }
    });
}

function initializeScrollEffects() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const observeElements = document.querySelectorAll(
        '.timeline-content, .product-card, .gift-card, .step'
    );
    
    observeElements.forEach(element => {
        observer.observe(element);
    });
}

function initializeAnimations() {
    // Add CSS for scroll animations
    const style = document.createElement('style');
    style.textContent = `
        .timeline-content,
        .product-card,
        .gift-card,
        .step {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .timeline-content.animate-in,
        .product-card.animate-in,
        .gift-card.animate-in,
        .step.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .hero-content > * {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
    `;
    document.head.appendChild(style);
}

// Modal functionality
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Focus management for accessibility
        const firstFocusable = modal.querySelector('input, button, textarea, select');
        if (firstFocusable) {
            firstFocusable.focus();
        }
    }
}

function closeModal(modal) {
    if (typeof modal === 'string') {
        modal = document.getElementById(modal);
    }
    
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
        document.body.style.overflow = 'auto';
    }
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        closeModal(modal);
    });
}

// Add close button functionality to all modals
document.querySelectorAll('.modal .close').forEach(closeBtn => {
    closeBtn.addEventListener('click', function() {
        const modal = this.closest('.modal');
        closeModal(modal);
    });
});

// User session management
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
            authBtn.textContent = currentUser.name;
            authBtn.onclick = () => openModal('userDashboard');
        } else {
            authBtn.textContent = 'Sign In';
            authBtn.onclick = () => openModal('authModal');
        }
    }
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--army-green)' : 
                     type === 'error' ? 'var(--burgundy-red)' : 
                     'var(--charcoal)'};
        color: var(--cream-white);
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 3000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Form validation utility
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateForm(formElement) {
    const inputs = formElement.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        const value = input.value.trim();
        
        if (!value) {
            showFieldError(input, 'This field is required');
            isValid = false;
        } else if (input.type === 'email' && !validateEmail(value)) {
            showFieldError(input, 'Please enter a valid email address');
            isValid = false;
        } else {
            clearFieldError(input);
        }
    });
    
    return isValid;
}

function showFieldError(input, message) {
    clearFieldError(input);
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: var(--burgundy-red);
        font-size: 0.8rem;
        margin-top: 0.25rem;
    `;
    
    input.parentNode.appendChild(errorElement);
    input.style.borderColor = 'var(--burgundy-red)';
}

function clearFieldError(input) {
    const existingError = input.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    input.style.borderColor = '';
}

// Export functions for global access
window.chocolateBar = {
    openModal,
    closeModal,
    scrollToSection,
    showNotification,
    validateForm,
    updateAuthButton
};

// Performance optimizations
window.addEventListener('scroll', throttle(handleScroll, 16));
window.addEventListener('resize', debounce(handleResize, 250));