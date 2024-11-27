document.addEventListener('DOMContentLoaded', () => {
    const productContainer = document.querySelector('main');
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    let cart = [];

    // Fetch products from API
    fetch('/api/products')
        .then(response => response.json())
        .then(products => {
            products.forEach(product => {
                const productElement = document.createElement('div');
                productElement.className = 'product';
                productElement.innerHTML = `
                    <h2>${product.name}</h2>
                    <p>Price: $${product.price}</p>
                    <button class="add-to-cart" data-name="${product.name}" data-price="${product.price}">Add to Cart</button>
                `;
                productContainer.appendChild(productElement);
            });

            setupAddToCartButtons();
        });

    function setupAddToCartButtons() {
        const buttons = document.querySelectorAll('.add-to-cart');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const name = button.getAttribute('data-name');
                const price = parseFloat(button.getAttribute('data-price'));

                // Add item to cart
                const itemIndex = cart.findIndex(item => item.name === name);
                if (itemIndex > -1) {
                    cart[itemIndex].quantity += 1;
                } else {
                    cart.push({ name, price, quantity: 1 });
                }

                updateCart();
            });
        });
    }

    function updateCart() {
        // Update cart count
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;

        // Update cart items
        cartItems.innerHTML = cart
            .map(item => `<div>${item.name} x${item.quantity} - $${item.price * item.quantity}</div>`)
            .join('');

        // Update total
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        cartTotal.textContent = total.toFixed(2);
    }
});
