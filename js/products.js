// Products data and functionality
const productsData = [
    {
        id: 1,
        name: "Midnight Passion",
        description: "Dark chocolate infused with raspberry and rose petals, crafted for moments of deep connection.",
        price: 28.99,
        image: "linear-gradient(135deg, #3E2723, #8B3A3A)",
        emotion: "Love",
        ingredients: ["85% Dark Chocolate", "Raspberry", "Rose Petals", "Vanilla"],
        story: "Born from a moonlit evening in our workshop, this bar captures the intensity of forbidden love and the sweetness of stolen moments."
    },
    {
        id: 2,
        name: "Golden Serenity",
        description: "Milk chocolate with honey and lavender, designed to bring calm to your chaotic day.",
        price: 24.99,
        image: "linear-gradient(135deg, #8D6E63, #D4AF37)",
        emotion: "Calm",
        ingredients: ["Swiss Milk Chocolate", "Wildflower Honey", "French Lavender", "Sea Salt"],
        story: "Inspired by golden hour in Provence, each bite transports you to fields of lavender swaying in the gentle evening breeze."
    },
    {
        id: 3,
        name: "Ancestral Memories",
        description: "White chocolate with cinnamon and dried fruits, evoking childhood nostalgia.",
        price: 26.99,
        image: "linear-gradient(135deg, #FFF8E1, #8BC34A)",
        emotion: "Nostalgic",
        ingredients: ["Ivory White Chocolate", "Ceylon Cinnamon", "Dried Apricots", "Almonds"],
        story: "Recreating grandmother's kitchen on Sunday mornings, where love was measured in spoonfuls and memories were made."
    },
    {
        id: 4,
        name: "Wild Spirit",
        description: "Dark chocolate with chili and exotic fruits for the adventurous soul.",
        price: 29.99,
        image: "linear-gradient(135deg, #FF5722, #9C27B0)",
        emotion: "Bold",
        ingredients: ["70% Dark Chocolate", "Bird's Eye Chili", "Passion Fruit", "Ginger"],
        story: "For those who dance with danger and find beauty in the untamed - this bar is your anthem."
    },
    {
        id: 5,
        name: "Velvet Embrace",
        description: "Silky milk chocolate with salted caramel, perfect for moments of comfort.",
        price: 25.99,
        image: "linear-gradient(135deg, #6D4C41, #8B3A3A)",
        emotion: "Comfort",
        ingredients: ["Belgian Milk Chocolate", "Salted Caramel", "Tahitian Vanilla", "Fleur de Sel"],
        story: "Like a warm embrace on a cold day, this bar wraps you in layers of indulgence and security."
    },
    {
        id: 6,
        name: "Citrus Dreams",
        description: "White chocolate infused with orange zest and crystallized ginger.",
        price: 27.99,
        image: "linear-gradient(135deg, #FF9800, #FFF8E1)",
        emotion: "Joy",
        ingredients: ["Premium White Chocolate", "Orange Zest", "Crystallized Ginger", "Lemon Thyme"],
        story: "Sunshine captured in chocolate form - each bite brings the warmth of Mediterranean summers to your palate."
    }
];

// Bar builder state
let barBuilderState = {
    step: 1,
    selections: {
        base: null,
        fruit: null,
        emotion: null
    },
    price: 24.99
};

// Load products into the grid
function loadProducts() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    productsData.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
    
    // Add stagger animation
    const productCards = productsGrid.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Create product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card hover-lift';
    card.setAttribute('data-product-id', product.id);
    
    card.innerHTML = `
        <div class="product-image" style="background: ${product.image}">
            <div class="product-emotion-badge">${product.emotion}</div>
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">$${product.price}</div>
            <button class="add-to-cart button-ripple" onclick="addToCart(${product.id})">
                Add to Cart
            </button>
        </div>
    `;
    
    // Add click handler for product modal
    card.addEventListener('click', (e) => {
        if (!e.target.matches('button')) {
            showProductModal(product);
        }
    });
    
    return card;
}

// Show product modal
function showProductModal(product) {
    const modal = document.getElementById('product-modal');
    const productDetail = document.getElementById('product-detail');
    
    productDetail.innerHTML = `
        <div class="product-detail-image" style="background: ${product.image}"></div>
        <div class="product-detail-info">
            <h2 class="product-detail-name">${product.name}</h2>
            <p class="product-detail-description">${product.story}</p>
            <div class="product-ingredients">
                <h4>Ingredients:</h4>
                <ul>
                    ${product.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                </ul>
            </div>
            <div class="product-detail-price">$${product.price}</div>
            <div class="product-detail-actions">
                <button class="add-to-cart-detail button-ripple" onclick="addToCart(${product.id}); closeProductModal();">
                    Add to Cart
                </button>
                <button class="send-as-gift button-ripple" onclick="sendAsGift(${product.id})">
                    Send as Gift
                </button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close product modal
function closeProductModal() {
    const modal = document.getElementById('product-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Send as gift functionality
function sendAsGift(productId) {
    const product = productsData.find(p => p.id === productId);
    if (product) {
        // Show gift customization modal or redirect to gift page
        showNotification(`${product.name} added to gift selection!`, 'success');
        closeProductModal();
        // Here you could open a gift customization modal
    }
}

// Initialize bar builder
function initializeBarBuilder() {
    setupBarBuilderEvents();
    updateBarPreview();
}

// Setup bar builder event listeners
function setupBarBuilderEvents() {
    const options = document.querySelectorAll('.option');
    
    options.forEach(option => {
        option.addEventListener('click', () => {
            const type = option.getAttribute('data-type');
            const value = option.getAttribute('data-value');
            
            // Remove previous selection in this category
            const categoryOptions = document.querySelectorAll(`[data-type="${type}"]`);
            categoryOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Select current option
            option.classList.add('selected');
            
            // Update state
            barBuilderState.selections[type] = value;
            
            // Update preview
            updateBarPreview();
            
            // Auto-advance to next step if not on last step
            if (barBuilderState.step < 3) {
                setTimeout(() => {
                    nextStep();
                }, 500);
            } else {
                // Enable add to cart button
                const addButton = document.getElementById('add-custom-bar');
                addButton.disabled = false;
                addButton.textContent = 'Add Custom Bar to Cart';
            }
        });
    });
    
    // Add to cart button for custom bar
    const addCustomBarBtn = document.getElementById('add-custom-bar');
    if (addCustomBarBtn) {
        addCustomBarBtn.addEventListener('click', () => {
            addCustomBarToCart();
        });
    }
}

// Next step in bar builder
function nextStep() {
    if (barBuilderState.step < 3) {
        // Hide current step
        const currentStep = document.querySelector(`.step[data-step="${barBuilderState.step}"]`);
        currentStep.classList.remove('active');
        
        // Show next step
        barBuilderState.step++;
        const nextStep = document.querySelector(`.step[data-step="${barBuilderState.step}"]`);
        nextStep.classList.add('active');
        
        // Update navigation buttons
        updateBuilderNavigation();
    }
}

// Previous step in bar builder
function previousStep() {
    if (barBuilderState.step > 1) {
        // Hide current step
        const currentStep = document.querySelector(`.step[data-step="${barBuilderState.step}"]`);
        currentStep.classList.remove('active');
        
        // Show previous step
        barBuilderState.step--;
        const prevStep = document.querySelector(`.step[data-step="${barBuilderState.step}"]`);
        prevStep.classList.add('active');
        
        // Update navigation buttons
        updateBuilderNavigation();
    }
}

// Update builder navigation buttons
function updateBuilderNavigation() {
    const prevBtn = document.querySelector('.nav-btn.prev');
    const nextBtn = document.querySelector('.nav-btn.next');
    
    // Update previous button
    if (prevBtn) {
        prevBtn.disabled = barBuilderState.step === 1;
    }
    
    // Update next button
    if (nextBtn) {
        if (barBuilderState.step === 3) {
            nextBtn.style.display = 'none';
        } else {
            nextBtn.style.display = 'block';
            const currentSelection = getCurrentStepSelection();
            nextBtn.disabled = !currentSelection;
        }
    }
}

// Get current step selection
function getCurrentStepSelection() {
    const stepType = ['base', 'fruit', 'emotion'][barBuilderState.step - 1];
    return barBuilderState.selections[stepType];
}

// Update bar preview
function updateBarPreview() {
    const preview = document.getElementById('chocolate-preview');
    const nameElement = document.getElementById('preview-name');
    const descriptionElement = document.getElementById('preview-description');
    const priceElement = document.getElementById('preview-price');
    
    if (!preview) return;
    
    // Update visual layers
    const baseLayer = preview.querySelector('.base-layer');
    const fruitLayer = preview.querySelector('.fruit-layer');
    const emotionLayer = preview.querySelector('.emotion-layer');
    
    // Base layer colors
    const baseColors = {
        dark: 'linear-gradient(45deg, #3E2723, #5D4037)',
        milk: 'linear-gradient(45deg, #8D6E63, #6D4C41)',
        white: 'linear-gradient(45deg, #FFF8E1, #F5F5DC)'
    };
    
    // Fruit layer colors
    const fruitColors = {
        berry: 'radial-gradient(circle, rgba(233, 30, 99, 0.7) 30%, transparent 70%)',
        citrus: 'radial-gradient(circle, rgba(255, 152, 0, 0.7) 30%, transparent 70%)',
        exotic: 'radial-gradient(circle, rgba(156, 39, 176, 0.7) 30%, transparent 70%)'
    };
    
    // Emotion layer effects
    const emotionColors = {
        calm: 'linear-gradient(45deg, rgba(232, 234, 246, 0.5), rgba(197, 202, 233, 0.5))',
        bold: 'linear-gradient(45deg, rgba(255, 87, 34, 0.5), rgba(216, 67, 21, 0.5))',
        nostalgic: 'linear-gradient(45deg, rgba(139, 195, 74, 0.5), rgba(104, 159, 56, 0.5))'
    };
    
    // Apply selected styles
    if (barBuilderState.selections.base && baseLayer) {
        baseLayer.style.background = baseColors[barBuilderState.selections.base];
    }
    
    if (barBuilderState.selections.fruit && fruitLayer) {
        fruitLayer.style.background = fruitColors[barBuilderState.selections.fruit];
    }
    
    if (barBuilderState.selections.emotion && emotionLayer) {
        emotionLayer.style.background = emotionColors[barBuilderState.selections.emotion];
    }
    
    // Update name and description
    const customName = generateCustomName();
    const customDescription = generateCustomDescription();
    
    if (nameElement) nameElement.textContent = customName;
    if (descriptionElement) descriptionElement.textContent = customDescription;
    if (priceElement) priceElement.textContent = `$${barBuilderState.price}`;
}

// Generate custom bar name
function generateCustomName() {
    const { base, fruit, emotion } = barBuilderState.selections;
    
    const baseNames = {
        dark: 'Midnight',
        milk: 'Golden',
        white: 'Ivory'
    };
    
    const fruitNames = {
        berry: 'Berry',
        citrus: 'Citrus',
        exotic: 'Tropical'
    };
    
    const emotionNames = {
        calm: 'Serenity',
        bold: 'Fire',
        nostalgic: 'Memory'
    };
    
    let name = 'Your Custom Bar';
    
    if (base && fruit && emotion) {
        name = `${baseNames[base]} ${fruitNames[fruit]} ${emotionNames[emotion]}`;
    } else if (base && fruit) {
        name = `${baseNames[base]} ${fruitNames[fruit]} Delight`;
    } else if (base) {
        name = `${baseNames[base]} Creation`;
    }
    
    return name;
}

// Generate custom bar description
function generateCustomDescription() {
    const { base, fruit, emotion } = barBuilderState.selections;
    
    const descriptions = {
        base: {
            dark: 'rich and mysterious',
            milk: 'smooth and comforting',
            white: 'delicate and pure'
        },
        fruit: {
            berry: 'with bursts of sweet-tart berries',
            citrus: 'brightened with zesty citrus',
            exotic: 'enhanced with exotic tropical notes'
        },
        emotion: {
            calm: 'designed to soothe your soul',
            bold: 'crafted to ignite your passion',
            nostalgic: 'made to awaken cherished memories'
        }
    };
    
    let parts = [];
    
    if (base) parts.push(descriptions.base[base]);
    if (fruit) parts.push(descriptions.fruit[fruit]);
    if (emotion) parts.push(descriptions.emotion[emotion]);
    
    if (parts.length === 0) {
        return 'Select options to see your creation';
    }
    
    return `A ${parts.join(', ')} chocolate experience.`;
}

// Add custom bar to cart
function addCustomBarToCart() {
    const customBar = {
        id: 'custom-' + Date.now(),
        name: generateCustomName(),
        description: generateCustomDescription(),
        price: barBuilderState.price,
        selections: { ...barBuilderState.selections },
        isCustom: true
    };
    
    // Add to cart (this will call the cart functionality)
    addToCartWithProduct(customBar);
    
    // Show success message
    showNotification('Your custom bar has been added to cart!', 'success');
    
    // Reset builder (optional)
    // resetBarBuilder();
}

// Reset bar builder
function resetBarBuilder() {
    barBuilderState = {
        step: 1,
        selections: {
            base: null,
            fruit: null,
            emotion: null
        },
        price: 24.99
    };
    
    // Reset UI
    document.querySelectorAll('.option').forEach(option => {
        option.classList.remove('selected');
    });
    
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    
    document.querySelector('.step[data-step="1"]').classList.add('active');
    
    const addButton = document.getElementById('add-custom-bar');
    if (addButton) {
        addButton.disabled = true;
        addButton.textContent = 'Add to Cart';
    }
    
    updateBarPreview();
    updateBuilderNavigation();
}

// Add product to cart by ID
function addToCart(productId) {
    const product = productsData.find(p => p.id === productId);
    if (product) {
        addToCartWithProduct(product);
        
        // Add visual feedback
        const button = event.target;
        button.classList.add('add-to-cart-success');
        
        setTimeout(() => {
            button.classList.remove('add-to-cart-success');
        }, 2000);
        
        showNotification(`${product.name} added to cart!`, 'success');
    }
}

// Search products
function searchProducts(query) {
    const filteredProducts = productsData.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.emotion.toLowerCase().includes(query.toLowerCase())
    );
    
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<p class="no-products">No products found matching your search.</p>';
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Filter products by emotion
function filterByEmotion(emotion) {
    const filteredProducts = emotion === 'all' 
        ? productsData 
        : productsData.filter(product => product.emotion.toLowerCase() === emotion.toLowerCase());
    
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Get product by ID
function getProductById(id) {
    return productsData.find(product => product.id === id);
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('product-modal');
    if (e.target === modal) {
        closeProductModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeProductModal();
    }
});

// Export functions for global use
window.ProductsApp = {
    loadProducts,
    addToCart,
    showProductModal,
    closeProductModal,
    nextStep,
    previousStep,
    searchProducts,
    filterByEmotion,
    getProductById,
    resetBarBuilder
};