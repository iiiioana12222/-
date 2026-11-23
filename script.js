const products = [
{
id: 1,
name: "Класически бургер",
category: "Бургери",
price: 5.50,
emoji: "🍔",
description: "Телешко месо, кашкавал, салата и сос."
},
{
id: 2,
name: "Чийзбургер",
category: "Бургери",
price: 6.00,
emoji: "🍔",
description: "Сочно месо, двоен кашкавал и специален сос."
},
{
id: 3,
name: "Пеперони",
category: "Пици",
price: 7.00,
emoji: "🍕",
description: "Доматен сос, кашкавал и пеперони."
},
{
id: 4,
name: "Маргарита",
category: "Пици",
price: 6.50,
emoji: "🍕",
description: "Доматен сос, кашкавал и босилек."
},
{
id: 5,
name: "Клуб сандвич",
category: "Сандвичи",
price: 5.00,
emoji: "🥪",
description: "Пилешко месо, домат, сирене и сос."
},
{
id: 6,
name: "Картофки",
category: "Картофки",
price: 3.00,
emoji: "🍟",
description: "Хрупкави картофки със сол."
},
{
id: 7,
name: "Кола",
category: "Напитки",
price: 2.00,
emoji: "🥤",
description: "Студена безалкохолна напитка."
},
{
id: 8,
name: "Лимонада",
category: "Напитки",
price: 2.50,
emoji: "🍋",
description: "Освежаваща лимонада."
},
{
id: 9,
name: "Шоколадова торта",
category: "Десерти",
price: 4.00,
emoji: "🍰",
description: "Нежна торта с шоколадов крем."
}
];

let cart = [];
let selectedCategory = "Всички";

const productsContainer = document.getElementById("products");
const searchInput = document.getElementById("search");

function formatPrice(price) {
return price.toFixed(2) + " €";
}

function renderProducts() {
const searchText = searchInput.value.toLowerCase();

const filtered = products.filter(product => {
const matchesCategory =
selectedCategory === "Всички" ||
product.category === selectedCategory;

const matchesSearch =
product.name.toLowerCase().includes(searchText);

return matchesCategory && matchesSearch;
});

if (filtered.length === 0) {
productsContainer.innerHTML =
'<p class="no-results">Няма намерени продукти.</p>';
return;
}

productsContainer.innerHTML = filtered.map(product => `
<div class="product-card">
<div class="product-image">${product.emoji}</div>
<div class="product-info">
<h3>${product.name}</h3>
<p>${product.description}</p>
<div class="product-bottom">
<span class="price">${formatPrice(product.price)}</span>
<button class="add-button"
onclick="addToCart(${product.id})">
+ Добави
</button>
</div>
</div>
</div>
`).join("");
}

document.querySelectorAll(".category").forEach(button => {
button.addEventListener("click", () => {
document.querySelectorAll(".category").forEach(btn =>
btn.classList.remove("active")
);

button.classList.add("active");
selectedCategory = button.dataset.category;
renderProducts();
});
});

searchInput.addEventListener("input", renderProducts);

function addToCart(id) {
const product = products.find(item => item.id === id);
const existing = cart.find(item => item.id === id);

if (existing) {
existing.quantity++;
} else {
cart.push({ ...product, quantity: 1 });
}

renderCart();
}

function changeQuantity(id, amount) {
const item = cart.find(item => item.id === id);

if (!item) return;

item.quantity += amount;

if (item.quantity <= 0) {
cart = cart.filter(item => item.id !== id);
}

renderCart();
}

function removeFromCart(id) {
cart = cart.filter(item => item.id !== id);
renderCart();
}

function getTotal() {
return cart.reduce(
(sum, item) => sum + item.price * item.quantity, 0
);
}

function renderCart() {
const cartItems = document.getElementById("cart-items");
const count = cart.reduce(
(sum, item) => sum + item.quantity, 0
);

document.getElementById("cart-count").textContent = count;
document.getElementById("total").textContent =
formatPrice(getTotal());

document.getElementById("checkout-total").textContent =
formatPrice(getTotal());

if (cart.length === 0) {
cartItems.innerHTML =
'<p class="empty">Количката е празна.</p>';
return;
}

cartItems.innerHTML = cart.map(item => `
<div class="cart-item">
<div>
<h4>${item.emoji} ${item.name}</h4>
<small>${formatPrice(item.price * item.quantity)}</small>
<br>
<button class="remove"
onclick="removeFromCart(${item.id})">
Премахни
</button>
</div>

<div class="quantity">
<button onclick="changeQuantity(${item.id}, -1)">−</button>
<span>${item.quantity}</span>
<button onclick="changeQuantity(${item.id}, 1)">+</button>
</div>
</div>
`).join("");
}

function toggleCart() {
document.getElementById("cart-panel").classList.toggle("open");
document.getElementById("overlay").classList.toggle("show");
}

function showCheckout() {
if (cart.length === 0) {
alert("Добави продукти в количката!");
return;
}

document.getElementById("cart-panel").classList.remove("open");
document.getElementById("overlay").classList.remove("show");
document.getElementById("checkout").classList.add("show");
}

function hideCheckout() {
document.getElementById("checkout").classList.remove("show");
}

document.getElementById("delivery-type").addEventListener("change", function() {
const addressField = document.getElementById("address-field");
const addressInput = document.getElementById("customer-address");

if (this.value === "Доставка") {
addressField.style.display = "block";
addressInput.required = true;
} else {
addressField.style.display = "none";
addressInput.required = false;
addressInput.value = "";
}
});

document.getElementById("order-form").addEventListener("submit", function(event) {
event.preventDefault();

if (cart.length === 0) {
alert("Количката е празна!");
return;
}

const name = document.getElementById("customer-name").value;
const delivery = document.getElementById("delivery-type").value;
const total = formatPrice(getTotal());

alert(
"Благодарим ти, " + name + "!\n" +
"Поръчката ти е приета успешно.\n" +
"Начин на получаване: " + delivery + "\n" +
"Обща сума: " + total
);

cart = [];
renderCart();
this.reset();
document.getElementById("address-field").style.display = "block";
document.getElementById("customer-address").required = true;
hideCheckout();
});

renderProducts();
renderCart();
