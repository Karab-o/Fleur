// Advanced animations and effects
class AnimationController {
    constructor() {
        this.observers = new Map();
        this.animationQueue = [];
        this.isAnimating = false;
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupParticleSystem();
        this.setupTextAnimations();
    }

    // Setup scroll-based animations
    setupScrollAnimations() {
        const observerOptions = {
            threshold: [0, 0.1, 0.5, 0.9],
            rootMargin: '-50px 0px -50px 0px'
        };

        // Create intersection observer for scroll animations
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const element = entry.target;
                const animationType = element.dataset.animation || 'fadeInUp';
                
                if (entry.isIntersecting) {
                    this.triggerAnimation(element, animationType);
                }
            });
        }, observerOptions);

        // Observe elements with animation data attributes
        document.querySelectorAll('[data-animation]').forEach(element => {
            scrollObserver.observe(element);
        });

        this.observers.set('scroll', scrollObserver);
    }

    // Setup hover effects
    setupHoverEffects() {
        // Product cards hover effects
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('.product-card')) {
                this.enhanceProductCardHover(e.target.closest('.product-card'));
            }
            
            if (e.target.closest('.gift-card')) {
                this.enhanceGiftCardHover(e.target.closest('.gift-card'));
            }
            
            if (e.target.closest('.option')) {
                this.enhanceOptionHover(e.target.closest('.option'));
            }
        });

        document.addEventListener('mouseleave', (e) => {
            if (e.target.closest('.product-card')) {
                this.resetProductCardHover(e.target.closest('.product-card'));
            }
            
            if (e.target.closest('.gift-card')) {
                this.resetGiftCardHover(e.target.closest('.gift-card'));
            }
            
            if (e.target.closest('.option')) {
                this.resetOptionHover(e.target.closest('.option'));
            }
        });
    }

    // Enhanced product card hover
    enhanceProductCardHover(card) {
        const image = card.querySelector('.product-image');
        if (image) {
            this.addFloatingParticles(image, 5);
            this.addGlowEffect(card);
        }
    }

    resetProductCardHover(card) {
        this.removeFloatingParticles(card);
        this.removeGlowEffect(card);
    }

    // Enhanced gift card hover
    enhanceGiftCardHover(card) {
        this.addShimmerEffect(card);
    }

    resetGiftCardHover(card) {
        this.removeShimmerEffect(card);
    }

    // Enhanced option hover for bar builder
    enhanceOptionHover(option) {
        const visual = option.querySelector('.option-visual');
        if (visual) {
            this.addPulseEffect(visual);
        }
    }

    resetOptionHover(option) {
        const visual = option.querySelector('.option-visual');
        if (visual) {
            this.removePulseEffect(visual);
        }
    }

    // Trigger specific animation
    triggerAnimation(element, animationType) {
        if (element.dataset.animated === 'true') return;
        
        element.dataset.animated = 'true';
        
        switch (animationType) {
            case 'fadeInUp':
                this.fadeInUp(element);
                break;
            case 'slideInLeft':
                this.slideInLeft(element);
                break;
            case 'slideInRight':
                this.slideInRight(element);
                break;
            case 'scaleIn':
                this.scaleIn(element);
                break;
            case 'typewriter':
                this.typewriter(element);
                break;
            case 'stagger':
                this.staggerChildren(element);
                break;
            default:
                this.fadeInUp(element);
        }
    }

    // Animation methods
    fadeInUp(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }

    slideInLeft(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateX(-50px)';
        element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        });
    }

    slideInRight(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateX(50px)';
        element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        });
    }

    scaleIn(element) {
        element.style.opacity = '0';
        element.style.transform = 'scale(0.8)';
        element.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        });
    }

    typewriter(element) {
        const text = element.textContent;
        element.textContent = '';
        element.style.opacity = '1';
        
        let i = 0;
        const timer = setInterval(() => {
            element.textContent += text.charAt(i);
            i++;
            if (i >= text.length) {
                clearInterval(timer);
            }
        }, 50);
    }

    staggerChildren(element) {
        const children = Array.from(element.children);
        children.forEach((child, index) => {
            child.style.opacity = '0';
            child.style.transform = 'translateY(20px)';
            child.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            
            setTimeout(() => {
                child.style.opacity = '1';
                child.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Particle system
    setupParticleSystem() {
        this.particleContainer = document.createElement('div');
        this.particleContainer.className = 'particle-container';
        this.particleContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;
        document.body.appendChild(this.particleContainer);
    }

    addFloatingParticles(container, count = 3) {
        const rect = container.getBoundingClientRect();
        
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: #D4AF37;
                border-radius: 50%;
                left: ${rect.left + Math.random() * rect.width}px;
                top: ${rect.top + Math.random() * rect.height}px;
                opacity: 0;
                animation: floatUp 2s ease-out forwards;
                pointer-events: none;
            `;
            
            this.particleContainer.appendChild(particle);
            
            // Remove particle after animation
            setTimeout(() => {
                particle.remove();
            }, 2000);
        }
    }

    removeFloatingParticles(container) {
        const particles = this.particleContainer.querySelectorAll('.floating-particle');
        particles.forEach(particle => {
            particle.style.animation = 'none';
            particle.style.opacity = '0';
        });
    }

    // Glow effects
    addGlowEffect(element) {
        element.style.boxShadow = '0 0 30px rgba(212, 175, 55, 0.3)';
        element.style.transition = 'box-shadow 0.3s ease';
    }

    removeGlowEffect(element) {
        element.style.boxShadow = '';
    }

    // Shimmer effects
    addShimmerEffect(element) {
        const shimmer = document.createElement('div');
        shimmer.className = 'shimmer-overlay';
        shimmer.style.cssText = `
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
            transition: left 0.6s ease;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(shimmer);
        
        requestAnimationFrame(() => {
            shimmer.style.left = '100%';
        });
        
        setTimeout(() => {
            shimmer.remove();
        }, 600);
    }

    removeShimmerEffect(element) {
        const shimmer = element.querySelector('.shimmer-overlay');
        if (shimmer) {
            shimmer.remove();
        }
    }

    // Pulse effects
    addPulseEffect(element) {
        element.style.animation = 'pulse 1s ease-in-out infinite';
    }

    removePulseEffect(element) {
        element.style.animation = '';
    }

    // Text animations
    setupTextAnimations() {
        this.observeTextElements();
    }

    observeTextElements() {
        const textObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    if (element.dataset.textAnimation) {
                        this.animateText(element, element.dataset.textAnimation);
                    }
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('[data-text-animation]').forEach(element => {
            textObserver.observe(element);
        });
    }

    animateText(element, animationType) {
        if (element.dataset.textAnimated === 'true') return;
        element.dataset.textAnimated = 'true';

        switch (animationType) {
            case 'split-reveal':
                this.splitRevealText(element);
                break;
            case 'wave':
                this.waveText(element);
                break;
            case 'glow':
                this.glowText(element);
                break;
        }
    }

    splitRevealText(element) {
        const text = element.textContent;
        const words = text.split(' ');
        element.innerHTML = '';

        words.forEach((word, wordIndex) => {
            const wordSpan = document.createElement('span');
            wordSpan.style.display = 'inline-block';
            wordSpan.style.marginRight = '0.25em';
            
            word.split('').forEach((char, charIndex) => {
                const charSpan = document.createElement('span');
                charSpan.textContent = char;
                charSpan.style.display = 'inline-block';
                charSpan.style.opacity = '0';
                charSpan.style.transform = 'translateY(20px)';
                charSpan.style.transition = 'all 0.3s ease';
                
                setTimeout(() => {
                    charSpan.style.opacity = '1';
                    charSpan.style.transform = 'translateY(0)';
                }, (wordIndex * 100) + (charIndex * 50));
                
                wordSpan.appendChild(charSpan);
            });
            
            element.appendChild(wordSpan);
        });
    }

    waveText(element) {
        const text = element.textContent;
        element.innerHTML = '';
        
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.display = 'inline-block';
            span.style.animation = `wave 1s ease-in-out infinite`;
            span.style.animationDelay = `${index * 0.1}s`;
            element.appendChild(span);
        });
    }

    glowText(element) {
        element.style.textShadow = '0 0 10px rgba(212, 175, 55, 0.8)';
        element.style.transition = 'text-shadow 0.3s ease';
    }

    // Background animations
    createBackgroundAnimation() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        `;
        
        document.body.appendChild(canvas);
        
        this.resizeCanvas(canvas);
        this.animateBackground(ctx, canvas);
        
        window.addEventListener('resize', () => this.resizeCanvas(canvas));
    }

    resizeCanvas(canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    animateBackground(ctx, canvas) {
        const particles = [];
        const particleCount = 50;
        
        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.3 + 0.1
            });
        }
        
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                // Update position
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                
                // Wrap around edges
                if (particle.x < 0) particle.x = canvas.width;
                if (particle.x > canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = canvas.height;
                if (particle.y > canvas.height) particle.y = 0;
                
                // Draw particle
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(212, 175, 55, ${particle.opacity})`;
                ctx.fill();
            });
            
            requestAnimationFrame(animate);
        }
        
        animate();
    }

    // Loading animations
    createLoadingAnimation(container) {
        const loader = document.createElement('div');
        loader.className = 'chocolate-loader';
        loader.innerHTML = `
            <div class="loader-bar">
                <div class="loader-fill"></div>
            </div>
            <div class="loader-text">Crafting your experience...</div>
        `;
        
        loader.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
        `;
        
        container.appendChild(loader);
        return loader;
    }

    // Page transition animations
    createPageTransition(fromPage, toPage) {
        return new Promise((resolve) => {
            // Fade out current page
            fromPage.style.transition = 'opacity 0.5s ease';
            fromPage.style.opacity = '0';
            
            setTimeout(() => {
                fromPage.style.display = 'none';
                toPage.style.display = 'block';
                toPage.style.opacity = '0';
                
                // Fade in new page
                requestAnimationFrame(() => {
                    toPage.style.transition = 'opacity 0.5s ease';
                    toPage.style.opacity = '1';
                });
                
                setTimeout(resolve, 500);
            }, 500);
        });
    }

    // Cleanup method
    destroy() {
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        this.observers.clear();
        
        if (this.particleContainer) {
            this.particleContainer.remove();
        }
    }
}

// Initialize animation controller
const animationController = new AnimationController();

// Additional utility functions
function createRippleEffect(element, event) {
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        pointer-events: none;
        transform: scale(0);
        animation: ripple 0.6s linear;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Auto-initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    // Add ripple effect to buttons
    document.addEventListener('click', (e) => {
        if (e.target.matches('button.button-ripple')) {
            createRippleEffect(e.target, e);
        }
    });
    
    // Add CSS for animations
    addAnimationStyles();
});

// Add required CSS styles
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        @keyframes floatUp {
            0% {
                opacity: 0;
                transform: translateY(0) scale(0);
            }
            10% {
                opacity: 1;
                transform: translateY(-10px) scale(1);
            }
            100% {
                opacity: 0;
                transform: translateY(-50px) scale(0.5);
            }
        }
        
        @keyframes wave {
            0%, 60%, 100% {
                transform: translateY(0);
            }
            30% {
                transform: translateY(-10px);
            }
        }
        
        .loader-bar {
            width: 200px;
            height: 4px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 2px;
            overflow: hidden;
            margin-bottom: 1rem;
        }
        
        .loader-fill {
            height: 100%;
            background: linear-gradient(90deg, #8B3A3A, #D4AF37);
            border-radius: 2px;
            animation: loading 2s ease-in-out infinite;
        }
        
        @keyframes loading {
            0% {
                width: 0%;
            }
            50% {
                width: 70%;
            }
            100% {
                width: 100%;
            }
        }
        
        .loader-text {
            color: #5B6B5B;
            font-style: italic;
        }
    `;
    
    document.head.appendChild(style);
}

// Export animation controller
window.AnimationController = AnimationController;
window.animationController = animationController;