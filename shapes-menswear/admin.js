/* ==========================================================================
   SHAPES MAN — ATELIER ADMIN SUITE JAVASCRIPT
   ========================================================================== */

let adminProducts = [];
let adminOrders = [];

document.addEventListener("DOMContentLoaded", () => {
    loadAdminData();
    renderProductsTable();
    renderOrdersTable();
    setupAdminNavigation();
});

function loadAdminData() {
    adminProducts = JSON.parse(localStorage.getItem("shapes_mens_products")) || [];
    adminOrders = JSON.parse(localStorage.getItem("shapes_mens_orders")) || [];
    
    // Metrics
    document.getElementById("metric-products-count").innerText = adminProducts.length;
    document.getElementById("metric-orders-count").innerText = adminOrders.length;
    const revenue = adminOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    document.getElementById("metric-revenue").innerText = "₹ " + revenue.toLocaleString("en-IN");
}

function setupAdminNavigation() {
    document.querySelectorAll(".admin-nav-item").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".admin-nav-item").forEach(b => b.classList.remove("active"));
            document.querySelectorAll(".admin-section").forEach(s => s.classList.remove("active"));
            
            btn.classList.add("active");
            const target = btn.dataset.target;
            document.getElementById(target)?.classList.add("active");
        });
    });
}

function renderProductsTable() {
    const tbody = document.getElementById("admin-products-tbody");
    if (!tbody) return;

    tbody.innerHTML = adminProducts.map((p, index) => `
        <tr>
            <td>
                <img src="images/${p.image}" alt="${p.title}" style="width: 40px; height: 50px; object-fit: cover; border-radius: 2px;">
            </td>
            <td><strong>${p.title}</strong><br><small style="color: var(--admin-grey);">${p.fabric}</small></td>
            <td><span style="color: var(--admin-gold);">${p.category}</span></td>
            <td>₹ ${p.price.toLocaleString("en-IN")}</td>
            <td>${p.inventory}</td>
            <td>
                <button class="admin-btn admin-btn-danger" style="padding: 4px 8px; font-size: 10px;" onclick="deleteProduct(${index})"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `).join("");
}

function renderOrdersTable() {
    const tbody = document.getElementById("admin-orders-tbody");
    if (!tbody) return;

    if (adminOrders.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--admin-grey); padding: 2rem;">No orders placed yet.</td></tr>`;
        return;
    }

    tbody.innerHTML = adminOrders.map((o, index) => `
        <tr>
            <td><strong style="color: var(--admin-gold);">${o.orderId}</strong></td>
            <td>${o.date}</td>
            <td><strong>${o.customer?.name || 'VIP Client'}</strong><br><small style="color: var(--admin-grey);">${o.customer?.phone || ''}</small></td>
            <td>${o.items?.map(i => `${i.title} (${i.size})`).join("<br>") || 'Garments'}</td>
            <td>₹ ${(o.total || 0).toLocaleString("en-IN")}</td>
            <td>
                <select style="background: var(--admin-surface); color: var(--admin-gold); border: 1px solid var(--admin-border); padding: 4px; font-size: 11px;" onchange="updateOrderStatus(${index}, this.value)">
                    <option value="Pattern Drafting" ${o.status === 'Pattern Drafting' ? 'selected' : ''}>Pattern Drafting</option>
                    <option value="Hand-Cutting" ${o.status === 'Hand-Cutting' ? 'selected' : ''}>Hand-Cutting</option>
                    <option value="Tailoring & Monogram" ${o.status === 'Tailoring & Monogram' ? 'selected' : ''}>Tailoring</option>
                    <option value="Quality Checked" ${o.status === 'Quality Checked' ? 'selected' : ''}>Quality Checked</option>
                    <option value="Dispatched" ${o.status === 'Dispatched' ? 'selected' : ''}>Dispatched</option>
                </select>
            </td>
        </tr>
    `).join("");
}

function addProduct(e) {
    e.preventDefault();
    const title = document.getElementById("p-title").value;
    const category = document.getElementById("p-category").value;
    const price = parseInt(document.getElementById("p-price").value) || 6990;
    const inventory = parseInt(document.getElementById("p-inventory").value) || 10;
    const image = document.getElementById("p-image").value || "shirt_white_giza.webp";
    const fabric = document.getElementById("p-fabric").value;
    const description = document.getElementById("p-desc").value;
    const craft = document.getElementById("p-craft").value;

    const newProd = {
        id: "m" + Date.now(),
        title,
        category,
        price,
        inventory,
        image,
        fabric,
        description,
        craft
    };

    adminProducts.unshift(newProd);
    localStorage.setItem("shapes_mens_products", JSON.stringify(adminProducts));
    alert("✨ New shirt garment added to catalog!");
    document.getElementById("add-product-form").reset();
    renderProductsTable();
    loadAdminData();
}

function deleteProduct(index) {
    if (confirm("Are you sure you want to remove this garment from the catalog?")) {
        adminProducts.splice(index, 1);
        localStorage.setItem("shapes_mens_products", JSON.stringify(adminProducts));
        renderProductsTable();
        loadAdminData();
    }
}

function updateOrderStatus(index, newStatus) {
    if (!adminOrders[index]) return;
    adminOrders[index].status = newStatus;
    localStorage.setItem("shapes_mens_orders", JSON.stringify(adminOrders));
    alert(`Order ${adminOrders[index].orderId} updated to ${newStatus}`);
}

function resetDefaultCatalog() {
    if (confirm("Reset store catalog to initial bespoke garments?")) {
        localStorage.removeItem("shapes_mens_products");
        location.reload();
    }
}
