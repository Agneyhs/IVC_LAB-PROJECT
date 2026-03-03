// realistic product catalog with categories and descriptions
const products = [
    { id: 1, name: "Wireless Mouse", price: 2500, img: "https://via.placeholder.com/220?text=Mouse", category: "Accessories", desc: "Ergonomic wireless mouse with adjustable DPI." },
    { id: 2, name: "Bluetooth Headphones", price: 7500, img: "https://via.placeholder.com/220?text=Headphones", category: "Audio", desc: "Noise-cancelling over-ear headphones with long battery life." },
    { id: 3, name: "USB-C Charger", price: 2000, img: "https://via.placeholder.com/220?text=Charger", category: "Accessories", desc: "Fast charging 45W USB-C power adapter." },
    { id: 4, name: "Smart LED Bulb", price: 1500, img: "https://via.placeholder.com/220?text=LED+Bulb", category: "Home", desc: "WiFi-enabled LED bulb controllable via app." },
    { id: 5, name: "Portable Speaker", price: 4500, img: "https://via.placeholder.com/220?text=Speaker", category: "Audio", desc: "Bluetooth speaker with 10hr playtime and rugged design." },
    { id: 6, name: "Webcam 1080p", price: 5500, img: "https://via.placeholder.com/220?text=Webcam", category: "Accessories", desc: "Full HD webcam with built-in mic and privacy shutter." },
    { id: 7, name: "Matte Lipstick", price: 1200, img: "https://via.placeholder.com/220?text=Lipstick", category: "Cosmetics", desc: "Long-lasting matte finish lipstick in various shades." },
    { id: 8, name: "Running Sneakers", price: 3500, img: "https://via.placeholder.com/220?text=Sneakers", category: "Footwear", desc: "Lightweight running shoes with cushioned sole." },
    { id: 9, name: "Graphic T-Shirt", price: 900, img: "https://via.placeholder.com/220?text=T-Shirt", category: "Apparel", desc: "100% cotton printed graphic tee." },
    { id: 10, name: "Digital Watch", price: 2700, img: "https://via.placeholder.com/220?text=Watch", category: "Accessories", desc: "Water-resistant digital watch with date display." },
    { id: 11, name: "Foundation Cream", price: 1800, img: "https://via.placeholder.com/220?text=Foundation", category: "Cosmetics", desc: "Smooth finish foundation cream for all skin types." },
    { id: 12, name: "Leather Sandals", price: 2200, img: "https://via.placeholder.com/220?text=Sandals", category: "Footwear", desc: "Comfortable leather sandals for casual wear." },
];
let cart = [];
let filteredProducts = [...products];
const categories = [...new Set(products.map(p => p.category))];
const festivalDiscount = 0.20;
let isFestival = true;

function renderProducts(list = filteredProducts) {
    const container = document.getElementById("products");
    container.innerHTML = "";
    list.forEach(p => {
        const price = isFestival ? p.price * (1 - festivalDiscount) : p.price;
        const original = isFestival ? `₹${p.price}` : '';
        const displayPrice = `₹${price.toFixed(2)}`;
        const priceHtml = isFestival ? `<span class="original">${original}</span> ${displayPrice}` : displayPrice;
        const div = document.createElement("div");
        div.className = "product";
        div.dataset.id = p.id;
        div.innerHTML = `
            <img src="${p.img}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p class="price">${priceHtml}</p>
            <button data-id="${p.id}">Add to cart</button>
        `;
        container.appendChild(div);
    });
}

function updateCartCount() {
    document.getElementById("cart-count").textContent = cart.length;
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartDisplay() {
    const list = document.getElementById("cart-list");
    list.innerHTML = "";
    cart.forEach((item, idx) => {
        const li = document.createElement("li");
        const itemPrice = isFestival ? item.price * (1 - festivalDiscount) : item.price;
        li.innerHTML = `${item.name} - ₹${itemPrice.toFixed(2)} <button class="remove" data-index="${idx}">&times;</button>`;
        list.appendChild(li);
    });
    document.getElementById("cart-total").textContent = `Total: ₹${calculateTotal().toFixed(2)}`;
}

function calculateTotal() {
    return cart.reduce((sum, item) => {
        const price = isFestival ? item.price * (1 - festivalDiscount) : item.price;
        return sum + price;
    }, 0);
}

function showCart() {
    const contents = document.getElementById("cart-contents");
    updateCartDisplay();
    contents.classList.toggle("hidden");
}

function filterProducts(query) {
    filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase())
    );
    applyCategory();
    applySort();
    renderProducts();
}
function applyCategory() {
    const cat = document.getElementById('category-select').value;
    if (cat) filteredProducts = filteredProducts.filter(p => p.category === cat);
}
function applySort() {
    const sort = document.getElementById('sort-select').value;
    if (sort === 'price-asc') filteredProducts.sort((a,b)=>a.price-b.price);
    else if (sort === 'price-desc') filteredProducts.sort((a,b)=>b.price-a.price);
}
function showDetails(id) {
    const p = products.find(prod=>prod.id===id);
    if (!p) return;
    document.getElementById('detail-img').src=p.img;
    document.getElementById('detail-name').textContent=p.name;
    document.getElementById('detail-desc').textContent=p.desc||'';
    const price = isFestival ? p.price*(1-festivalDiscount) : p.price;
    document.getElementById('detail-price').textContent=`Price: ₹${price.toFixed(2)}`;
    document.getElementById('detail-add').dataset.id=id;
    document.getElementById('detail-modal').classList.add('show');
}
function closeDetails(){ document.getElementById('detail-modal').classList.remove('show'); }
function showToast() {
    const toast = document.getElementById('toast');
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3000);
}

document.addEventListener("DOMContentLoaded", () => {
    const saved = localStorage.getItem('cart');
    if (saved) cart = JSON.parse(saved);
    renderProducts();
    updateCartCount();
    const catSelect = document.getElementById('category-select');
    categories.forEach(c=>{const opt=document.createElement('option');opt.value=c;opt.textContent=c;catSelect.appendChild(opt);});
    if (isFestival) document.getElementById('offer-banner').classList.remove('hidden');

    document.getElementById("products").addEventListener("click", e => {
        if (e.target.tagName === "BUTTON") {
            const id = parseInt(e.target.dataset.id, 10);
            const product = products.find(p => p.id === id);
            cart.push(product);
            updateCartCount();
            showCart();
            showToast();
        } else {
            const card = e.target.closest('.product');
            if (card) showDetails(parseInt(card.dataset.id,10));
        }
    });

    document.getElementById("search-input").addEventListener("input", e => { filterProducts(e.target.value); });
    document.getElementById('category-select').addEventListener('change', () => { filterProducts(document.getElementById('search-input').value); });
    document.getElementById('sort-select').addEventListener('change', () => { applySort(); renderProducts(); });
    document.getElementById("view-cart-link").addEventListener("click", e => { e.preventDefault(); showCart(); });
    document.getElementById('clear-cart').addEventListener('click', e => { e.preventDefault(); cart=[]; updateCartCount(); updateCartDisplay(); localStorage.removeItem('cart'); });

    document.getElementById('close-modal').addEventListener('click', closeDetails);
    document.getElementById('detail-add').addEventListener('click', () => {
        const id = parseInt(document.getElementById('detail-add').dataset.id,10);
        cart.push(products.find(p=>p.id===id)); updateCartCount(); closeDetails();
    });

    document.getElementById('login-link').addEventListener('click', e => { e.preventDefault(); document.getElementById('login-modal').classList.add('show'); });
    document.getElementById('close-login').addEventListener('click', () => { document.getElementById('login-modal').classList.remove('show'); });
    document.getElementById('login-form').addEventListener('submit', e => { e.preventDefault(); alert('Login demo only'); document.getElementById('login-modal').classList.remove('show'); });

    document.getElementById('checkout').addEventListener('click', () => {
        if (cart.length===0) return alert('Cart is empty');
        document.getElementById('payment-total').textContent=`Total: ₹${calculateTotal().toFixed(2)}`;
        document.getElementById('payment-modal').classList.add('show');
        document.getElementById("cart-contents").classList.add("hidden");
    });
    document.getElementById('close-payment').addEventListener('click', () => { document.getElementById('payment-modal').classList.remove('show'); });
    document.getElementById('payment-form').addEventListener('submit', e => {
        e.preventDefault();
        const method=document.querySelector('input[name="method"]:checked').value;
        alert(`Payment successful via ${method.toUpperCase()}\nTotal: ₹${calculateTotal().toFixed(2)}`);
        cart=[]; updateCartCount(); updateCartDisplay(); document.getElementById('payment-modal').classList.remove('show');
    });
    document.getElementById('toast-view').addEventListener('click', e => { e.preventDefault(); showCart(); });
    document.getElementById('toast-checkout').addEventListener('click', e => { e.preventDefault(); showCart(); document.getElementById('checkout').click(); });
});
