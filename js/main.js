// Main website functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the website
    initializeWebsite();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize scroll animations
    initializeScrollAnimations();
});

// Initialize website functionality
function initializeWebsite() {
    // Check if user has visited before
    const hasVisited = localStorage.getItem('hasVisitedFleur');
    
    if (hasVisited) {
        // Skip welcome page for returning users
        enterSite();
    } else {
        // Show welcome page for new users
        showWelcomePage();
    }
    
    // Initialize navbar scroll behavior
    initializeNavbar();
    
    // Load products
    loadProducts();
    
    // Initialize bar builder
    initializeBarBuilder();
}

// Show welcome page
function showWelcomePage() {
    const welcomePage = document.getElementById('welcome-page');
    const mainSite = document.getElementById('main-site');
    
    welcomePage.classList.add('active');
    mainSite.classList.remove('active');
    
    // Add ambient particles animation
    createAmbientParticles();
}

// Enter main site
function enterSite() {
    const welcomePage = document.getElementById('welcome-page');
    const mainSite = document.getElementById('main-site');
    
    // Mark as visited
    localStorage.setItem('hasVisitedFleur', 'true');
    
    // Transition to main site
    welcomePage.classList.add('hidden');
    
    setTimeout(() => {
        welcomePage.style.display = 'none';
        mainSite.classList.add('active');
        
        // Start hero animations
        startHeroAnimations();
    }, 1000);
}

// Create ambient particles for welcome page
function createAmbientParticles() {
    const particles = document.querySelector('.ambient-particles');
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 4 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = '#D4AF37';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.opacity = Math.random() * 0.5 + 0.3;
        particle.style.animation = `float ${Math.random() * 6 + 4}s ease-in-out infinite`;
        particle.style.animationDelay = Math.random() * 4 + 's';
        
        particles.appendChild(particle);
    }
}

// Start hero animations
function startHeroAnimations() {
    const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .cta-button, .scroll-indicator');
    
    heroElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

// Initialize navbar behavior
function initializeNavbar() {
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Setup event listeners
function setupEventListeners() {
    // Navigation menu toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking on links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // User menu toggle
    const userIcon = document.querySelector('.user-icon');
    const userDropdown = document.getElementById('user-dropdown');
    
    if (userIcon && userDropdown) {
        userIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            userDropdown.classList.remove('active');
        });
    }
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
    
    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Newsletter subscription
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubscription);
    }
    
    // Parallax effect for hero section
    window.addEventListener('scroll', handleParallax);
}

// Smooth scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80; // Account for navbar height
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Handle parallax scrolling
function handleParallax() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    const parallaxLayers = document.querySelectorAll('.parallax-layer');
    parallaxLayers.forEach((layer, index) => {
        const speed = (index + 1) * 0.3;
        layer.style.transform = `translateY(${scrolled * speed}px)`;
    });
}

// Initialize scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
            }
        });
    }, observerOptions);
    
    // Observe all elements with reveal classes
    const revealElements = document.querySelectorAll('.reveal-on-scroll, .timeline-item');
    revealElements.forEach(element => {
        observer.observe(element);
    });
}

// Handle contact form submission
function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const formObject = {};
    
    formData.forEach((value, key) => {
        formObject[key] = value;
    });
    
    // Show loading state
    const submitBtn = e.target.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual form handling)
    setTimeout(() => {
        showNotification('Thank you! Your message has been sent.', 'success');
        e.target.reset();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Add send animation
        submitBtn.classList.add('add-to-cart-success');
        setTimeout(() => {
            submitBtn.classList.remove('add-to-cart-success');
        }, 2000);
    }, 2000);
}

// Handle newsletter subscription
function handleNewsletterSubscription(e) {
    e.preventDefault();
    
    const email = e.target.querySelector('input[type="email"]').value;
    
    if (email) {
        // Simulate subscription
        showNotification('Welcome to our chocolate journey!', 'success');
        e.target.reset();
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3',
        color: 'white',
        padding: '15px 20px',
        borderRadius: '10px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
        zIndex: '10001',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        maxWidth: '300px',
        wordWrap: 'break-word'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// User menu toggle
function toggleUserMenu() {
    const userDropdown = document.getElementById('user-dropdown');
    userDropdown.classList.toggle('active');
}

// Apply promo code
function applyPromo() {
    const promoInput = document.getElementById('promo-input');
    const promoCode = promoInput.value.trim().toLowerCase();
    
    const validCodes = {
        'love2024': 15,
        'sweetdeal': 10,
        'chocolate': 20,
        'mystery': 25
    };
    
    if (validCodes[promoCode]) {
        const discount = validCodes[promoCode];
        showNotification(`Promo code applied! ${discount}% discount added.`, 'success');
        localStorage.setItem('promoDiscount', discount);
        promoInput.value = '';
        
        // Update cart total if cart is open
        updateCartDisplay();
    } else {
        showNotification('Invalid promo code. Please try again.', 'error');
    }
}

// Add sparkle effect on button clicks
function addSparkleEffect(element) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle-effect';
    
    Object.assign(sparkle.style, {
        position: 'absolute',
        width: '10px',
        height: '10px',
        background: '#D4AF37',
        borderRadius: '50%',
        pointerEvents: 'none',
        animation: 'sparkle 1s ease-out forwards'
    });
    
    const rect = element.getBoundingClientRect();
    sparkle.style.left = (rect.left + Math.random() * rect.width) + 'px';
    sparkle.style.top = (rect.top + Math.random() * rect.height) + 'px';
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
        sparkle.remove();
    }, 1000);
}

// Add button click effects
document.addEventListener('click', (e) => {
    if (e.target.matches('button:not(.close-cart):not(.close-auth):not(.close-modal)')) {
        addSparkleEffect(e.target);
    }
});

// Prevent form submission from refreshing page
document.addEventListener('submit', (e) => {
    if (e.target.matches('form')) {
        e.preventDefault();
    }
});

// Add loading states to buttons
function addLoadingState(button, text = 'Loading...') {
    const originalText = button.textContent;
    button.textContent = text;
    button.disabled = true;
    
    return () => {
        button.textContent = originalText;
        button.disabled = false;
    };
}

// Initialize tooltips for interactive elements
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = e.target.getAttribute('data-tooltip');
            
            Object.assign(tooltip.style, {
                position: 'absolute',
                background: 'rgba(0,0,0,0.8)',
                color: 'white',
                padding: '5px 10px',
                borderRadius: '5px',
                fontSize: '12px',
                zIndex: '10001',
                pointerEvents: 'none',
                whiteSpace: 'nowrap'
            });
            
            document.body.appendChild(tooltip);
            
            const rect = e.target.getBoundingClientRect();
            tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = (rect.top - tooltip.offsetHeight - 5) + 'px';
            
            e.target._tooltip = tooltip;
        });
        
        element.addEventListener('mouseleave', (e) => {
            if (e.target._tooltip) {
                e.target._tooltip.remove();
                delete e.target._tooltip;
            }
        });
    });
}

// Initialize performance optimizations
function initializePerformanceOptimizations() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        scrollTimeout = setTimeout(() => {
            // Handle scroll-dependent operations here
            handleParallax();
        }, 16); // ~60fps
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeTooltips();
    initializePerformanceOptimizations();
});

// Export functions for use in other modules
window.ChocolateApp = {
    enterSite,
    scrollToSection,
    toggleUserMenu,
    applyPromo,
    showNotification,
    addLoadingState
};