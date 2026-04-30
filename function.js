

    let cart = [];

    function addToCart(name, price) {
        cart.push({ name, price });
        updateCart();
    }

    function removeFromCart(index) {
        cart.splice(index, 1);
        updateCart();
    }

    function updateCart() {
        const cartItems = document.getElementById("cart-items");
        const totalDisplay = document.getElementById("total");
        const countDisplay = document.getElementById("cart-count");

        cartItems.innerHTML = "";
        let total = 0;

        cart.forEach((item, index) => {
            total += item.price;

            cartItems.innerHTML += `
                <div class="cart-item">
                    ${item.name} - $${item.price.toFixed(2)}
                    <button class="remove" onclick="removeFromCart(${index})">X</button>
                </div>
            `;
        });

        totalDisplay.textContent = total.toFixed(2);
        countDisplay.textContent = cart.length;
    }