// Products and Customization functionality

// Product data
const productsData = [
    {
        id: 1,
        name: "Midnight Berry",
        description: "Dark chocolate infused with wild berries and a whisper of nostalgia",
        price: 14.99,
        image: "dark-berry.jpg",
        category: "signature",
        ingredients: ["Dark Chocolate 70%", "Wild Berries", "Natural Vanilla"],
        emotion: "nostalgia",
        story: "Born from memories of midnight walks through berry fields under starlit skies."
    },
    {
        id: 2,
        name: "Golden Citrus Dream",
        description: "Milk chocolate embracing bright citrus notes for moments of pure joy",
        price: 13.99,
        image: "milk-citrus.jpg",
        category: "signature",
        ingredients: ["Milk Chocolate", "Orange Zest", "Lemon Oil", "Honey"],
        emotion: "joy",
        story: "Inspired by sun-drenched mornings and the first taste of summer."
    },
    {
        id: 3,
        name: "Serene White Exotic",
        description: "White chocolate with exotic fruits, crafted for moments of calm reflection",
        price: 15.99,
        image: "white-exotic.jpg",
        category: "signature",
        ingredients: ["White Chocolate", "Passion Fruit", "Mango", "Coconut"],
        emotion: "calm",
        story: "A gentle embrace of tranquility, like watching clouds drift on a peaceful afternoon."
    },
    {
        id: 4,
        name: "Bold Spice Adventure",
        description: "Dark chocolate with warming spices for the adventurous soul",
        price: 16.99,
        image: "dark-spice.jpg",
        category: "limited",
        ingredients: ["Dark Chocolate 85%", "Cinnamon", "Cardamom", "Pink Pepper"],
        emotion: "bold",
        story: "For those who dare to explore the depths of flavor and emotion."
    },
    {
        id: 5,
        name: "Comfort Berry Milk",
        description: "Creamy milk chocolate with comforting berry notes",
        price: 12.99,
        image: "milk-berry.jpg",
        category: "signature",
        ingredients: ["Milk Chocolate", "Strawberries", "Raspberries", "Vanilla"],
        emotion: "comfort",
        story: "Like a warm hug from someone who truly understands you."
    },
    {
        id: 6,
        name: "Mysterious Dark Forest",
        description: "Complex dark chocolate with forest fruit mysteries",
        price: 17.99,
        image: "dark-forest.jpg",
        category: "limited",
        ingredients: ["Dark Chocolate 90%", "Blackcurrant", "Elderberry", "Sage"],
        emotion: "mystery",
        story: "Secrets whispered by ancient trees, captured in every bite."
    }
];

// Customization options
const customizationOptions = {
    base: {
        dark: {
            name: "Dark Chocolate",
            description: "Rich, intense 70% cocoa",
            color: "#3E2723",
            price: 0
        },
        milk: {
            name: "Milk Chocolate",
            description: "Creamy and smooth",
            color: "#8D6E63",
            price: 0
        },
        white: {
            name: "White Chocolate",
            description: "Pure and delicate",
            color: "#FFF8E1",
            price: 1
        }
    },
    fruit: {
        berry: {
            name: "Berry Blend",
            description: "Strawberries, raspberries, blueberries",
            color: "#E91E63",
            price: 2
        },
        citrus: {
            name: "Citrus Burst",
            description: "Orange, lemon, lime zest",
            color: "#FF9800",
            price: 2
        },
        exotic: {
            name: "Exotic Dreams",
            description: "Passion fruit, mango, dragon fruit",
            color: "#4CAF50",
            price: 3
        }
    },
    emotion: {
        calm: {
            name: "Calm Essence",
            description: "Lavender and chamomile notes",
            color: "#2196F3",
            price: 1
        },
        bold: {
            name: "Bold Spirit",
            description: "Spices and warming elements",
            color: "#F44336",
            price: 1
        },
        nostalgic: {
            name: "Nostalgic Touch",
            description: "Vanilla and comforting aromatics",
            color: "#795548",
            price: 1
        }
    }
};

// Current customization state
let currentCustomization = {
    base: null,
    fruit: null,
    emotion: null,
    price: 12.99
};

// Initialize products when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeProducts();
    initializeCustomization();
});

function initializeProducts() {
    renderProducts();
    setupProductModals();
}

function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    productsGrid.innerHTML = '';

    productsData.forEach((product, index) => {
        const productCard = createProductCard(product, index);
        productsGrid.appendChild(productCard);
    });
}

function createProductCard(product, index) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-product-id', product.id);
    
    // Add stagger animation delay
    card.style.animationDelay = `${index * 0.1}s`;
    
    card.innerHTML = `
        <div class="product-image" style="background: linear-gradient(135deg, ${getProductGradient(product.emotion)})">
            <div class="product-overlay">
                <span class="emotion-tag">${product.emotion}</span>
            </div>
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">$${product.price}</div>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                Add to Cart
            </button>
        </div>
    `;

    // Add click event to open product modal
    card.addEventListener('click', function(e) {
        if (!e.target.classList.contains('add-to-cart-btn')) {
            openProductModal(product);
        }
    });

    return card;
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

function openProductModal(product) {
    const modal = document.getElementById('productModal');
    const modalImage = document.getElementById('modalProductImage');
    const modalName = document.getElementById('modalProductName');
    const modalDescription = document.getElementById('modalProductDescription');
    const modalPrice = document.getElementById('modalProductPrice');

    // Set product data
    modalImage.style.background = `linear-gradient(135deg, ${getProductGradient(product.emotion)})`;
    modalName.textContent = product.name;
    modalDescription.innerHTML = `
        <p>${product.description}</p>
        <div class="product-story">
            <h4>The Story</h4>
            <p><em>${product.story}</em></p>
        </div>
        <div class="product-ingredients">
            <h4>Ingredients</h4>
            <ul>${product.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}</ul>
        </div>
    `;
    modalPrice.textContent = `$${product.price}`;

    // Setup add to cart button
    const modalAddCart = modal.querySelector('.modal-add-cart');
    modalAddCart.onclick = () => {
        const quantity = modal.querySelector('.quantity').textContent;
        addToCart(product.id, parseInt(quantity));
        window.chocolateBar.closeModal('productModal');
    };

    // Setup quantity controls
    setupQuantityControls(modal);

    window.chocolateBar.openModal('productModal');
}

function setupQuantityControls(modal) {
    const minusBtn = modal.querySelector('.qty-btn.minus');
    const plusBtn = modal.querySelector('.qty-btn.plus');
    const quantitySpan = modal.querySelector('.quantity');

    minusBtn.onclick = () => {
        let qty = parseInt(quantitySpan.textContent);
        if (qty > 1) {
            quantitySpan.textContent = qty - 1;
        }
    };

    plusBtn.onclick = () => {
        let qty = parseInt(quantitySpan.textContent);
        if (qty < 10) {
            quantitySpan.textContent = qty + 1;
        }
    };
}

function setupProductModals() {
    // Additional modal setup can go here
    console.log('Product modals initialized');
}

// Customization functionality
function initializeCustomization() {
    setupCustomizationSteps();
    setupCustomizationPreview();
    resetCustomization();
}

function setupCustomizationSteps() {
    const steps = document.querySelectorAll('.step');
    
    steps.forEach(step => {
        const options = step.querySelectorAll('.option');
        
        options.forEach(option => {
            option.addEventListener('click', function() {
                const stepType = step.getAttribute('data-step');
                const optionValue = this.getAttribute('data-value');
                
                selectCustomizationOption(stepType, optionValue, step, this);
            });
        });
    });

    // Setup custom bar add to cart
    const addCustomBarBtn = document.getElementById('addCustomBar');
    if (addCustomBarBtn) {
        addCustomBarBtn.addEventListener('click', addCustomBarToCart);
    }
}

function selectCustomizationOption(stepType, optionValue, stepElement, optionElement) {
    // Remove previous selection in this step
    stepElement.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Add selection to clicked option
    optionElement.classList.add('selected');
    
    // Update customization state
    currentCustomization[stepType] = optionValue;
    
    // Update price
    updateCustomizationPrice();
    
    // Update preview
    updateCustomizationPreview();
    
    // Move to next step
    moveToNextStep(stepType);
    
    // Update bar name and description
    updateCustomBarDetails();
}

function moveToNextStep(currentStepType) {
    const steps = document.querySelectorAll('.step');
    const stepOrder = ['base', 'fruit', 'emotion'];
    const currentIndex = stepOrder.indexOf(currentStepType);
    
    // Remove active class from all steps
    steps.forEach(step => step.classList.remove('active'));
    
    // Add active class to next step or keep on last step
    const nextIndex = Math.min(currentIndex + 1, stepOrder.length - 1);
    const nextStep = document.querySelector(`[data-step="${stepOrder[nextIndex]}"]`);
    if (nextStep) {
        nextStep.classList.add('active');
    }
}

function updateCustomizationPrice() {
    let totalPrice = 12.99; // Base price
    
    if (currentCustomization.base && customizationOptions.base[currentCustomization.base]) {
        totalPrice += customizationOptions.base[currentCustomization.base].price;
    }
    
    if (currentCustomization.fruit && customizationOptions.fruit[currentCustomization.fruit]) {
        totalPrice += customizationOptions.fruit[currentCustomization.fruit].price;
    }
    
    if (currentCustomization.emotion && customizationOptions.emotion[currentCustomization.emotion]) {
        totalPrice += customizationOptions.emotion[currentCustomization.emotion].price;
    }
    
    currentCustomization.price = totalPrice;
    
    const priceElement = document.getElementById('barPrice');
    if (priceElement) {
        priceElement.textContent = `$${totalPrice.toFixed(2)}`;
    }
}

function updateCustomizationPreview() {
    const animatedBar = document.getElementById('customBar');
    if (!animatedBar) return;
    
    const barBase = animatedBar.querySelector('.bar-base');
    const barFruit = animatedBar.querySelector('.bar-fruit');
    const barEmotion = animatedBar.querySelector('.bar-emotion');
    
    // Update base
    if (currentCustomization.base && customizationOptions.base[currentCustomization.base]) {
        const baseOption = customizationOptions.base[currentCustomization.base];
        barBase.style.background = baseOption.color;
    }
    
    // Update fruit layer
    if (currentCustomization.fruit && customizationOptions.fruit[currentCustomization.fruit]) {
        const fruitOption = customizationOptions.fruit[currentCustomization.fruit];
        barFruit.style.background = `linear-gradient(45deg, transparent 30%, ${fruitOption.color}66 70%)`;
    }
    
    // Update emotion layer
    if (currentCustomization.emotion && customizationOptions.emotion[currentCustomization.emotion]) {
        const emotionOption = customizationOptions.emotion[currentCustomization.emotion];
        barEmotion.style.background = `linear-gradient(90deg, transparent 60%, ${emotionOption.color}44 100%)`;
    }
    
    // Add animation
    animatedBar.style.transform = 'scale(1.05)';
    setTimeout(() => {
        animatedBar.style.transform = 'scale(1)';
    }, 300);
}

function updateCustomBarDetails() {
    const barName = document.getElementById('barName');
    const barDescription = document.getElementById('barDescription');
    
    if (!barName || !barDescription) return;
    
    // Generate custom name
    let name = "Your Custom Creation";
    let description = "Select your preferences to see your unique bar";
    
    if (currentCustomization.base && currentCustomization.fruit && currentCustomization.emotion) {
        const baseOption = customizationOptions.base[currentCustomization.base];
        const fruitOption = customizationOptions.fruit[currentCustomization.fruit];
        const emotionOption = customizationOptions.emotion[currentCustomization.emotion];
        
        name = `${emotionOption.name} ${baseOption.name} with ${fruitOption.name}`;
        description = `${baseOption.description} enhanced with ${fruitOption.description.toLowerCase()} and ${emotionOption.description.toLowerCase()}`;
    }
    
    barName.textContent = name;
    barDescription.textContent = description;
}

function setupCustomizationPreview() {
    // Initial preview setup
    updateCustomizationPreview();
}

function resetCustomization() {
    currentCustomization = {
        base: null,
        fruit: null,
        emotion: null,
        price: 12.99
    };
    
    // Reset UI
    document.querySelectorAll('.option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Reset steps
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Activate first step
    const firstStep = document.querySelector('[data-step="base"]');
    if (firstStep) {
        firstStep.classList.add('active');
    }
    
    updateCustomizationPrice();
    updateCustomizationPreview();
    updateCustomBarDetails();
}

function addCustomBarToCart() {
    if (!currentCustomization.base || !currentCustomization.fruit || !currentCustomization.emotion) {
        window.chocolateBar.showNotification('Please complete all customization steps', 'error');
        return;
    }
    
    const customProduct = {
        id: 'custom-' + Date.now(),
        name: document.getElementById('barName').textContent,
        description: document.getElementById('barDescription').textContent,
        price: currentCustomization.price,
        custom: true,
        customization: { ...currentCustomization }
    };
    
    addToCart(customProduct, 1);
    
    // Show success message and reset
    window.chocolateBar.showNotification('Custom bar added to cart!', 'success');
    
    setTimeout(() => {
        resetCustomization();
    }, 1000);
}

// Add to cart functionality (interfaces with cart.js)
function addToCart(productId, quantity = 1) {
    let product;
    
    if (typeof productId === 'object') {
        // Custom product
        product = productId;
    } else {
        // Regular product
        product = productsData.find(p => p.id === productId);
        if (!product) {
            window.chocolateBar.showNotification('Product not found', 'error');
            return;
        }
    }
    
    // Use cart functionality from cart.js
    if (window.cart && window.cart.addItem) {
        window.cart.addItem(product, quantity);
    } else {
        // Fallback if cart.js isn't loaded
        console.log('Adding to cart:', product, quantity);
        window.chocolateBar.showNotification(`Added ${product.name} to cart!`, 'success');
    }
}

// Search and filter functionality
function filterProducts(category = 'all', emotion = 'all') {
    const filteredProducts = productsData.filter(product => {
        const categoryMatch = category === 'all' || product.category === category;
        const emotionMatch = emotion === 'all' || product.emotion === emotion;
        return categoryMatch && emotionMatch;
    });
    
    renderFilteredProducts(filteredProducts);
}

function renderFilteredProducts(products) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    products.forEach((product, index) => {
        const productCard = createProductCard(product, index);
        productsGrid.appendChild(productCard);
    });
    
    // Trigger animation for filtered products
    setTimeout(() => {
        products.forEach((_, index) => {
            const card = productsGrid.children[index];
            if (card) {
                card.classList.add('animate-in');
            }
        });
    }, 100);
}

function searchProducts(query) {
    const lowercaseQuery = query.toLowerCase();
    const searchResults = productsData.filter(product => 
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery) ||
        product.ingredients.some(ingredient => 
            ingredient.toLowerCase().includes(lowercaseQuery)
        )
    );
    
    renderFilteredProducts(searchResults);
}

// Export for global access
window.products = {
    data: productsData,
    customization: currentCustomization,
    filter: filterProducts,
    search: searchProducts,
    addToCart: addToCart,
    resetCustomization: resetCustomization
};