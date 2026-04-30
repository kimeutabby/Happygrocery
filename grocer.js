// Cart functionality
let cart = [];

function loadCart() {
    try {
        const storedCart = JSON.parse(localStorage.getItem('cart'));
        if (Array.isArray(storedCart)) {
            cart = storedCart.map(item => ({
                name: item.name || '',
                price: item.price || 'KSh 0',
                image: item.image || '',
                quantity: Number(item.quantity) || 0
            })).filter(item => item.name && item.quantity > 0);
        } else {
            cart = [];
        }
    } catch (error) {
        cart = [];
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCartPage();
}

function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (!cartCountElement) return;
    const totalItems = cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
    cartCountElement.textContent = `Cart: ${totalItems} item${totalItems === 1 ? '' : 's'}`;
}

function parsePrice(priceText) {
    return parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
}

function addToCart(product) {
    const existingProduct = cart.find(item => item.name === product.name);
    if (existingProduct) {
        existingProduct.quantity += product.quantity;
    } else {
        cart.push(product);
    }
    saveCart();
    alert(`${product.quantity} ${product.name}(s) added successfully!`);
}

function updateQuantity(productName, quantity) {
    const item = cart.find(product => product.name === productName);
    if (!item) return;
    item.quantity = quantity;
    saveCart();
}

function removeFromCart(productName) {
    cart = cart.filter(item => item.name !== productName);
    saveCart();
}

function renderCartPage() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSummary = document.getElementById('cart-summary');
    if (!cartItemsContainer || !cartSummary) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="cart-empty">Your cart is empty. Add items from the shop to see them here.</div>';
        cartSummary.innerHTML = '';
        return;
    }

    let totalItems = 0;
    let totalPrice = 0;
    cartItemsContainer.innerHTML = '';

    cart.forEach(item => {
        const price = parsePrice(item.price);
        const subtotal = price * item.quantity;
        totalItems += item.quantity;
        totalPrice += subtotal;

        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">${item.price}</div>
            <div class="quantity-control">
                <input type="number" min="1" value="${item.quantity}" data-product="${item.name}">
                <button type="button" class="remove-button" data-product="${item.name}">Remove</button>
            </div>
            <div class="cart-item-subtotal">KSh ${subtotal.toFixed(2)}</div>
        `;
        cartItemsContainer.appendChild(itemElement);
    });

    cartSummary.innerHTML = `
        <div>Total items: ${totalItems}</div>
        <div>Total price: KSh ${totalPrice.toFixed(2)}</div>
    `;

    cartItemsContainer.querySelectorAll('.quantity-control input').forEach(input => {
        input.addEventListener('change', event => {
            const name = event.target.dataset.product;
            const value = parseInt(event.target.value, 10);
            if (isNaN(value) || value < 1) {
                event.target.value = 1;
                return;
            }
            updateQuantity(name, value);
        });
    });

    cartItemsContainer.querySelectorAll('.remove-button').forEach(button => {
        button.addEventListener('click', event => {
            const productName = event.target.dataset.product;
            removeFromCart(productName);
        });
    });
}

function initCart() {
    loadCart();
    updateCartCount();
    renderCartPage();

    const addToCartButtons = document.querySelectorAll('.product-card button');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            if (!productCard) return;

            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.price').textContent;
            const productImage = productCard.querySelector('img').src;
            const quantity = parseInt(prompt(`How many ${productName} would you like to add to the cart?`, '1'), 10);
            if (isNaN(quantity) || quantity <= 0) {
                alert('Invalid quantity. Please enter a positive number.');
                return;
            }

            addToCart({
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: quantity
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', initCart);
