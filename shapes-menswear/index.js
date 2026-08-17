/* ==========================================================================
   SHAPES MAN — LUXURY MENSWEAR & BESPOKE SHIRTS ENGINE (CLEAN MINIMALIST)
   ========================================================================== */

const DEFAULT_MENS_PRODUCTS = [
    {
        id: "m1",
        title: "The Mayfair 160s Egyptian Giza Cotton Shirt",
        category: "Royal Giza Cotton",
        price: 8490,
        inventory: 18,
        image: "shirt_white_giza.webp",
        fabric: "160s/2-ply Pure Egyptian Giza Cotton Twill",
        description: "The quintessential gentleman's formal shirt. Woven from ultra-long staple 160s two-ply Egyptian Giza cotton for exceptional silky drape, natural luster, and breathability. Features iridescent Australian mother-of-pearl buttons, single needle tailoring, and split back yoke.",
        craft: "160s 2-Ply Giza Cotton, 22 stitches per inch, genuine Mother-of-Pearl buttons, removable brass collar stays. Machine wash gentle or Dry Clean."
    },
    {
        id: "m2",
        title: "The Amalfi Sage French Flax Linen Shirt",
        category: "Pure Linen",
        price: 6990,
        inventory: 14,
        image: "shirt_sage_linen.webp",
        fabric: "100% Certified Normandy French Flax (60 Lea)",
        description: "Effortless Mediterranean sophistication. Tailored from premium 60-lea French flax linen in soft sage olive. Features an airy camp collar, relaxed rolled sleeves, natural carved horn buttons, and a tailored silhouette that softens gracefully with every wash.",
        craft: "100% Normandy Flax Linen, pre-washed for zero shrinkage, natural horn buttons, reinforced side gussets. Gentle cold wash."
    },
    {
        id: "m3",
        title: "The Indigo Heritage Handblock Modal Shirt",
        category: "Handblock Prints",
        price: 6490,
        inventory: 16,
        image: "shirt_indigo_handblock.webp",
        fabric: "Artisanal Dabu Handblock on Pure Breathable Modal",
        description: "A tribute to traditional Indian blockprint artistry. Features intricate geometric botanical motifs stamped by hand in authentic natural indigo dye on silky modal cotton. Finished with tailored spread collar and dark horn buttons.",
        craft: "100% Eco-Modal Cotton, plant-based indigo blockprint, French seams, tailored fit. Wash separately in cold water."
    },
    {
        id: "m4",
        title: "The Sovereign Noir Raw Silk Bandhgala Shirt",
        category: "Festive & Evening",
        price: 11990,
        inventory: 9,
        image: "shirt_black_festive.webp",
        fabric: "Pure Mulberry Raw Silk with Antique Gold Zari",
        description: "Opulent regal evening attire for soirees and celebrations. Handcrafted from textured black raw silk with a structured bandhgala collar, highlighted with delicate antique gold zardozi and zari threadwork at the collar edge and cuffs.",
        craft: "Pure Raw Silk, handcrafted antique gold zari embroidery, concealed button placket with antique brass fasteners. Dry Clean Only."
    },
    {
        id: "m5",
        title: "The Capri Sand Slub Linen Resort Shirt",
        category: "Pure Linen",
        price: 7290,
        inventory: 12,
        image: "shirt_sand_linen.webp",
        fabric: "Pure Organic Slub Linen with Coconut Shell Buttons",
        description: "The ultimate warm-weather staple. Crafted in warm alabaster sand linen with subtle slub texture, relaxed spread collar, tailored chest pocket, and carved coconut shell buttons. Designed for coastal luxury and relaxed garden evenings.",
        craft: "100% Organic Linen, natural coconut buttons, dual back pleats for effortless mobility. Cold wash."
    }
];

const DEFAULT_MENS_CATEGORIES = [
    "Pure Linen",
    "Royal Giza Cotton",
    "Handblock Prints",
    "Festive & Evening"
];

const CURRENCY_RATES = {
    INR: { symbol: "₹", rate: 1, name: "INR" },
    USD: { symbol: "$", rate: 0.012, name: "USD" },
    GBP: { symbol: "£", rate: 0.0095, name: "GBP" },
    AED: { symbol: "AED ", rate: 0.044, name: "AED" },
    EUR: { symbol: "€", rate: 0.011, name: "EUR" }
};

const JOURNAL_ARTICLES_DATA = [
    {
        category: "Sartorial Craft",
        title: "The Anatomy of 160s 2-Ply Egyptian Giza Cotton",
        excerpt: "Why extra-long staple Giza yarn woven in Northern Italy produces the smoothest, most durable dress shirts in the world.",
        image: "shirt_white_giza.webp"
    },
    {
        category: "Style Editorial",
        title: "Mastering the Riviera Linen Silhouette",
        excerpt: "How to wear relaxed French flax linen with tailored trousers and Belgian loafers from morning espresso to sunset yachting.",
        image: "shirt_sand_linen.webp"
    },
    {
        category: "Heritage & Art",
        title: "Ancient Dabu Handblock Printing in Contemporary Menswear",
        excerpt: "The intricate resist-dyeing journey of natural indigo extracted from wild leaves to our bespoke modern shirts.",
        image: "shirt_indigo_handblock.webp"
    }
];

// App State
let mensProducts = [];
let mensCart = [];
let mensWishlist = [];
let currentCurrency = "INR";
let activeCategory = "All";
let searchQuery = "";
let currentSort = "default";
let selectedProduct = null;
let selectedSize = "40 (M)";
let selectedFit = "Tailored Contemporary";
let selectedCollar = "Spread Collar";

// Init Storefront
document.addEventListener("DOMContentLoaded", () => {
    initStore();
});

function initStore() {
    // Load products
    const savedProducts = localStorage.getItem("shapes_mens_products");
    if (savedProducts) {
        mensProducts = JSON.parse(savedProducts);
    } else {
        mensProducts = [...DEFAULT_MENS_PRODUCTS];
        localStorage.setItem("shapes_mens_products", JSON.stringify(mensProducts));
    }

    // Load Cart & Wishlist
    mensCart = JSON.parse(localStorage.getItem("shapes_mens_cart")) || [];
    mensWishlist = JSON.parse(localStorage.getItem("shapes_mens_wishlist")) || [];
    currentCurrency = localStorage.getItem("shapes_mens_currency") || "INR";

    // Setup currency select
    const curSelect = document.getElementById("currency-select");
    if (curSelect) {
        curSelect.value = currentCurrency;
        curSelect.addEventListener("change", (e) => {
            currentCurrency = e.target.value;
            localStorage.setItem("shapes_mens_currency", currentCurrency);
            renderProductGrid();
            renderCartDrawer();
            if (selectedProduct) updateModalPrice();
        });
    }

    // Setup components
    renderCategoryTabs();
    renderProductGrid();
    renderJournal();
    updateBadges();
    setupGlobalEvents();
    setupScrollObserver();
}

// Format Price with Currency
function formatPrice(amountInINR) {
    const cur = CURRENCY_RATES[currentCurrency] || CURRENCY_RATES.INR;
    const converted = Math.round(amountInINR * cur.rate);
    return `${cur.symbol}${converted.toLocaleString("en-IN")}`;
}

// Render Category Tabs
function renderCategoryTabs() {
    const container = document.getElementById("catalog-tabs-container");
    if (!container) return;

    let html = `<button class="tab-btn ${activeCategory === 'All' ? 'active' : ''}" data-cat="All">All Creations</button>`;
    DEFAULT_MENS_CATEGORIES.forEach(cat => {
        html += `<button class="tab-btn ${activeCategory === cat ? 'active' : ''}" data-cat="${cat}">${cat}</button>`;
    });
    container.innerHTML = html;

    container.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            container.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            activeCategory = btn.dataset.cat;
            renderProductGrid();
        });
    });
}

// Render Product Grid with Filter/Sort
function renderProductGrid() {
    const container = document.getElementById("product-list-container");
    if (!container) return;

    let filtered = mensProducts.filter(p => {
        const matchesCat = (activeCategory === "All" || p.category === activeCategory);
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              p.fabric.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              p.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCat && matchesSearch;
    });

    if (currentSort === "price-asc") {
        filtered.sort((a, b) => a.price - b.price);
    } else if (currentSort === "price-desc") {
        filtered.sort((a, b) => b.price - a.price);
    } else if (currentSort === "title-asc") {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    if (filtered.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; color: var(--grey-light);">
                <i class="fa-solid fa-shirt" style="font-size: 2.5rem; color: var(--gold); margin-bottom: 1rem; display: block;"></i>
                <p>No bespoke garments matched your search criteria.</p>
                <button class="hero-cta-btn hero-cta-gold" onclick="resetFilters()" style="margin-top: 1rem;">View All Creations</button>
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(product => {
        const isWish = mensWishlist.some(w => w.id === product.id);
        return `
            <div class="product-card" data-id="${product.id}">
                <div class="card-img-wrapper" onclick="openProductModal('${product.id}')">
                    <img src="images/${product.image}" alt="${product.title}" loading="lazy">
                    <span class="card-badge-gold">${product.category}</span>
                    <button class="card-wishlist-btn ${isWish ? 'active' : ''}" onclick="event.stopPropagation(); toggleWishlist('${product.id}')" title="Save to Wishlist">
                        <i class="${isWish ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                    </button>
                </div>
                <div class="card-info">
                    <span class="card-category">${product.category}</span>
                    <h3 class="card-title" onclick="openProductModal('${product.id}')">${product.title}</h3>
                    <p class="card-fabric-spec"><i class="fa-solid fa-feather-pointed" style="color: var(--gold); margin-right: 4px;"></i> ${product.fabric}</p>
                    <div class="card-footer">
                        <span class="card-price">${formatPrice(product.price)}</span>
                        <div class="card-actions">
                            <button class="quick-view-btn" onclick="openProductModal('${product.id}')">Tailor &amp; Bag</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join("");
}

function resetFilters() {
    activeCategory = "All";
    searchQuery = "";
    const searchInput = document.getElementById("boutique-search-input");
    if (searchInput) searchInput.value = "";
    renderCategoryTabs();
    renderProductGrid();
}

// Product Modal & Customizer
function openProductModal(productId) {
    const product = mensProducts.find(p => p.id === productId);
    if (!product) return;

    selectedProduct = product;
    selectedSize = "40 (M)";
    selectedFit = "Tailored Contemporary";
    selectedCollar = "Spread Collar";

    const modal = document.getElementById("product-detail-modal");
    if (!modal) return;

    document.getElementById("modal-product-image").src = `images/${product.image}`;
    document.getElementById("modal-product-image").alt = product.title;
    document.getElementById("modal-product-category").innerText = product.category;
    document.getElementById("modal-product-title").innerText = product.title;
    document.getElementById("modal-product-desc").innerText = product.description;
    document.getElementById("modal-fabric-detail").innerText = product.fabric;
    document.getElementById("modal-craftsmanship-detail").innerText = product.craft;
    
    updateModalPrice();
    resetModalOptionsUI();

    modal.classList.add("active");
    document.body.style.overflow = "hidden";
}

function updateModalPrice() {
    if (!selectedProduct) return;
    const priceEl = document.getElementById("modal-product-price");
    if (priceEl) {
        priceEl.innerText = formatPrice(selectedProduct.price);
    }
}

function resetModalOptionsUI() {
    // Sizes
    document.querySelectorAll(".size-btn").forEach(btn => {
        btn.classList.toggle("selected", btn.dataset.size === selectedSize);
    });
    // Fits
    document.querySelectorAll(".fit-btn").forEach(btn => {
        btn.classList.toggle("selected", btn.dataset.fit === selectedFit);
    });
    // Collars
    document.querySelectorAll(".collar-btn").forEach(btn => {
        btn.classList.toggle("selected", btn.dataset.collar === selectedCollar);
    });
}

function closeProductModal() {
    const modal = document.getElementById("product-detail-modal");
    if (modal) modal.classList.remove("active");
    document.body.style.overflow = "";
    selectedProduct = null;
}

// Add Custom Shirt to Bag
function addCurrentToCart() {
    if (!selectedProduct) return;

    const cartItem = {
        id: selectedProduct.id + "_" + Date.now(),
        productId: selectedProduct.id,
        title: selectedProduct.title,
        price: selectedProduct.price,
        image: selectedProduct.image,
        category: selectedProduct.category,
        size: selectedSize,
        fit: selectedFit,
        collar: selectedCollar,
        quantity: 1
    };

    mensCart.push(cartItem);
    saveCart();
    closeProductModal();
    openCartDrawer();
}

// Cart Drawer Management
function openCartDrawer() {
    renderCartDrawer();
    const drawer = document.getElementById("cart-drawer");
    if (drawer) drawer.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeCartDrawer() {
    const drawer = document.getElementById("cart-drawer");
    if (drawer) drawer.classList.remove("active");
    document.body.style.overflow = "";
}

function saveCart() {
    localStorage.setItem("shapes_mens_cart", JSON.stringify(mensCart));
    updateBadges();
}

function renderCartDrawer() {
    const container = document.getElementById("cart-items-container");
    const subtotalEl = document.getElementById("cart-subtotal");
    if (!container) return;

    if (mensCart.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem 1rem; color: var(--grey-light);">
                <i class="fa-solid fa-bag-shopping" style="font-size: 2.2rem; color: var(--gold); margin-bottom: 1rem; display: block;"></i>
                <p style="font-family: var(--font-serif); font-size: 1.2rem; color: var(--ivory);">Your shopping bag is empty.</p>
                <p style="font-size: 11px; margin-top: 0.4rem; color: var(--grey-medium);">Explore our handcrafted 160s Egyptian Giza and French linen shirts.</p>
            </div>
        `;
        if (subtotalEl) subtotalEl.innerText = formatPrice(0);
        return;
    }

    let subtotal = 0;
    container.innerHTML = mensCart.map((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        return `
            <div class="cart-item-row">
                <img src="images/${item.image}" alt="${item.title}" class="cart-item-img">
                <div class="cart-item-info">
                    <h4 class="cart-item-title">${item.title}</h4>
                    <p class="cart-item-spec">${item.size} · ${item.fit}</p>
                    <p class="cart-item-spec" style="color: var(--grey-light);">Collar: ${item.collar}</p>
                    <div class="cart-item-qty-row">
                        <div class="qty-pill">
                            <button class="qty-btn" onclick="updateCartItemQty(${index}, -1)">-</button>
                            <span class="qty-value">${item.quantity}</span>
                            <button class="qty-btn" onclick="updateCartItemQty(${index}, 1)">+</button>
                        </div>
                        <span class="cart-item-price">${formatPrice(itemTotal)}</span>
                        <button class="remove-cart-item-btn" onclick="removeCartItem(${index})" title="Remove item"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </div>
            </div>
        `;
    }).join("");

    if (subtotalEl) subtotalEl.innerText = formatPrice(subtotal);
}

function updateCartItemQty(index, change) {
    if (!mensCart[index]) return;
    mensCart[index].quantity += change;
    if (mensCart[index].quantity <= 0) {
        mensCart.splice(index, 1);
    }
    saveCart();
    renderCartDrawer();
}

function removeCartItem(index) {
    mensCart.splice(index, 1);
    saveCart();
    renderCartDrawer();
}

// Wishlist Management
function toggleWishlist(productId) {
    const product = mensProducts.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = mensWishlist.findIndex(w => w.id === productId);
    if (existingIndex >= 0) {
        mensWishlist.splice(existingIndex, 1);
    } else {
        mensWishlist.push(product);
    }

    localStorage.setItem("shapes_mens_wishlist", JSON.stringify(mensWishlist));
    updateBadges();
    renderProductGrid();
}

function openWishlistDrawer() {
    renderWishlistDrawer();
    const drawer = document.getElementById("wishlist-drawer");
    if (drawer) drawer.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeWishlistDrawer() {
    const drawer = document.getElementById("wishlist-drawer");
    if (drawer) drawer.classList.remove("active");
    document.body.style.overflow = "";
}

function renderWishlistDrawer() {
    const container = document.getElementById("wishlist-items-container");
    if (!container) return;

    if (mensWishlist.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem 1rem; color: var(--grey-light);">
                <i class="fa-regular fa-heart" style="font-size: 2.2rem; color: var(--gold); margin-bottom: 1rem; display: block;"></i>
                <p style="font-family: var(--font-serif); font-size: 1.2rem; color: var(--ivory);">Your wishlist is empty.</p>
                <p style="font-size: 11px; margin-top: 0.4rem; color: var(--grey-medium);">Bookmark your favorite sartorial creations to review later.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = mensWishlist.map((item, index) => {
        return `
            <div class="cart-item-row">
                <img src="images/${item.image}" alt="${item.title}" class="cart-item-img">
                <div class="cart-item-info">
                    <h4 class="cart-item-title">${item.title}</h4>
                    <p class="cart-item-spec">${item.category}</p>
                    <span class="cart-item-price">${formatPrice(item.price)}</span>
                    <div style="display: flex; gap: 8px; margin-top: 8px;">
                        <button class="quick-view-btn" onclick="openProductModal('${item.id}'); closeWishlistDrawer();">Customize &amp; Bag</button>
                        <button class="remove-cart-item-btn" onclick="toggleWishlist('${item.id}'); renderWishlistDrawer();"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </div>
            </div>
        `;
    }).join("");
}

function updateBadges() {
    const cartCount = mensCart.reduce((sum, item) => sum + item.quantity, 0);
    const wishCount = mensWishlist.length;

    const cartBadge = document.getElementById("cart-count");
    if (cartBadge) cartBadge.innerText = cartCount;

    const wishBadge = document.getElementById("wishlist-count");
    if (wishBadge) wishBadge.innerText = wishCount;
}

// Checkout & WhatsApp Ordering
function openCheckoutModal() {
    if (mensCart.length === 0) {
        alert("Your shopping bag is empty. Please add a garment to proceed.");
        return;
    }
    closeCartDrawer();
    const modal = document.getElementById("checkout-modal");
    if (modal) modal.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeCheckoutModal() {
    const modal = document.getElementById("checkout-modal");
    if (modal) modal.classList.remove("active");
    document.body.style.overflow = "";
}

function processCheckoutOrder(event) {
    event.preventDefault();
    const name = document.getElementById("cust-name").value;
    const email = document.getElementById("cust-email").value;
    const phone = document.getElementById("cust-phone").value;
    const address = document.getElementById("cust-address").value;
    const paymentMethod = document.querySelector('input[name="payment_method"]:checked')?.value || "online";

    let total = mensCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderId = "SM-" + Math.floor(100000 + Math.random() * 900000);

    const orderData = {
        orderId,
        date: new Date().toLocaleDateString(),
        customer: { name, email, phone, address },
        items: [...mensCart],
        total,
        status: "Pattern Drafting",
        paymentMethod
    };

    // Save order in history
    let orders = JSON.parse(localStorage.getItem("shapes_mens_orders")) || [];
    orders.unshift(orderData);
    localStorage.setItem("shapes_mens_orders", JSON.stringify(orders));

    if (paymentMethod === "whatsapp") {
        // Direct WhatsApp ordering message
        let msg = `*SHAPES MAN · BESPOKE ORDER ENQUIRY*\n`;
        msg += `*Order Reference:* ${orderId}\n`;
        msg += `*Customer:* ${name} (${phone})\n`;
        msg += `*Delivery Address:* ${address}\n\n`;
        msg += `*Selected Garments:*\n`;
        mensCart.forEach((item, i) => {
            msg += `${i+1}. *${item.title}*\n`;
            msg += `   - Size: ${item.size} | Fit: ${item.fit}\n`;
            msg += `   - Collar: ${item.collar}\n`;
            msg += `   - Qty: ${item.quantity} | Total: ${formatPrice(item.price * item.quantity)}\n`;
        });
        msg += `\n*Grand Total:* ${formatPrice(total)}\n`;
        msg += `_Please confirm my bespoke order and dispatch timeline._`;

        const waUrl = `https://wa.me/919833392756?text=${encodeURIComponent(msg)}`;
        mensCart = [];
        saveCart();
        closeCheckoutModal();
        window.open(waUrl, "_blank");
    } else {
        // Simulated Secure Online Payment
        alert(`✨ Thank you, ${name}! Your bespoke order (${orderId}) has been confirmed.\n\nOur master tailors will begin pattern drafting. You can track status using Order ID: ${orderId}`);
        mensCart = [];
        saveCart();
        closeCheckoutModal();
        window.location.href = `track.html?orderId=${orderId}`;
    }
}

// Editorial Journal
function renderJournal() {
    const container = document.getElementById("store-journal-grid");
    if (!container) return;

    container.innerHTML = JOURNAL_ARTICLES_DATA.map(art => {
        return `
            <article class="journal-card">
                <div class="journal-img">
                    <img src="images/${art.image}" alt="${art.title}" loading="lazy">
                </div>
                <div class="journal-body">
                    <span class="journal-category">${art.category}</span>
                    <h3>${art.title}</h3>
                    <p>${art.excerpt}</p>
                    <a href="info.html" class="journal-read-link">Read Full Essay <i class="fa-solid fa-arrow-right"></i></a>
                </div>
            </article>
        `;
    }).join("");
}

// Setup Event Listeners
function setupGlobalEvents() {
    // Search
    const searchInput = document.getElementById("boutique-search-input");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            searchQuery = e.target.value;
            renderProductGrid();
        });
    }

    // Sort
    const sortSelect = document.getElementById("boutique-sort-select");
    if (sortSelect) {
        sortSelect.addEventListener("change", (e) => {
            currentSort = e.target.value;
            renderProductGrid();
        });
    }

    // Drawers & Modals
    document.getElementById("open-cart-btn")?.addEventListener("click", openCartDrawer);
    document.getElementById("close-cart-btn")?.addEventListener("click", closeCartDrawer);
    document.getElementById("open-wishlist-btn")?.addEventListener("click", openWishlistDrawer);
    document.getElementById("close-wishlist-btn")?.addEventListener("click", closeWishlistDrawer);
    document.getElementById("wishlist-shop-btn")?.addEventListener("click", closeWishlistDrawer);
    document.getElementById("close-product-modal")?.addEventListener("click", closeProductModal);
    document.getElementById("proceed-checkout-btn")?.addEventListener("click", openCheckoutModal);
    document.getElementById("close-checkout-btn")?.addEventListener("click", closeCheckoutModal);
    document.getElementById("modal-add-to-cart-btn")?.addEventListener("click", addCurrentToCart);
    document.getElementById("billing-shipping-form")?.addEventListener("submit", processCheckoutOrder);

    // Mobile nav toggle
    const mobileToggle = document.getElementById("mobile-toggle");
    const mobileNav = document.getElementById("mobile-nav");
    if (mobileToggle && mobileNav) {
        mobileToggle.addEventListener("click", () => {
            mobileNav.classList.toggle("active");
        });
    }

    // Modal size/fit/collar selectors
    document.querySelectorAll(".size-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".size-btn").forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");
            selectedSize = btn.dataset.size;
        });
    });

    document.querySelectorAll(".fit-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".fit-btn").forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");
            selectedFit = btn.dataset.fit;
        });
    });

    document.querySelectorAll(".collar-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".collar-btn").forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");
            selectedCollar = btn.dataset.collar;
        });
    });

    // Accordions
    document.querySelectorAll(".accordion-header").forEach(header => {
        header.addEventListener("click", () => {
            header.parentElement.classList.toggle("active");
        });
    });
}

// Scroll animations observer
function setupScrollObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll(".animate-on-scroll").forEach(el => observer.observe(el));
}
