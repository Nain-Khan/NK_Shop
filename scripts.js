document.addEventListener('DOMContentLoaded', () => {
    const products = [
        { id: 1, name: 'Smartphone', price: 499, image: 'images/smartphone.jpg', category: 'electronics' },
        { id: 2, name: 'Laptop', price: 999, image: 'images/laptop.jpg', category: 'electronics' },
        { id: 3, name: 'Headphones', price: 199, image: 'images/headphones.jpg', category: 'electronics' },
        { id: 4, name: 'T-Shirt', price: 29, image: 'images/tshirt.jpg', category: 'clothing' },
        { id: 5, name: 'Jeans', price: 49, image: 'images/jeans.jpg', category: 'clothing' },
        { id: 6, name: 'Dress', price: 79, image: 'images/dress.jpg', category: 'clothing' },
        { id: 7, name: 'Watch', price: 149, image: 'images/watch.jpg', category: 'accessories' },
        { id: 8, name: 'Sunglasses', price: 99, image: 'images/sunglasses.jpg', category: 'accessories' },
        { id: 9, name: 'Necklace', price: 199, image: 'images/Necklace.jpg', category: 'accessories' },
    ];

    // User Authentication
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('signup-username').value;
            const password = document.getElementById('signup-password').value;

            let users = JSON.parse(localStorage.getItem('users')) || [];
            if (users.find(user => user.username === username)) {
                alert('Username already exists');
            } else {
                users.push({ username, password });
                localStorage.setItem('users', JSON.stringify(users));
                alert('Signup successful! You can now sign in.');
                window.location.href = 'signin.html';
            }
        });
    }

    const signinForm = document.getElementById('signin-form');
    if (signinForm) {
        signinForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('signin-username').value;
            const password = document.getElementById('signin-password').value;

            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(user => user.username === username && user.password === password);

            if (user) {
                alert('Signin successful!');
                localStorage.setItem('loggedInUser', JSON.stringify(user));
                window.location.href = 'index.html';
            } else {
                alert('Invalid username or password');
            }
        });
    }

    // Displaying Products
    const productGrid = document.querySelector('.product-grid');
    const category = document.body.getAttribute('data-category');

    if (productGrid) {
        const filteredProducts = products.filter(product => product.category === category || category === 'home');
        filteredProducts.forEach(product => {
            const productItem = document.createElement('div');
            productItem.classList.add('product-item');
            productItem.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>Price: $${product.price}</p>
                <button data-id="${product.id}">Add to Cart</button>
            `;
            productGrid.appendChild(productItem);
        });

        productGrid.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                const productId = e.target.getAttribute('data-id');
                addToCart(productId);
            }
        });
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    function addToCart(productId) {
        const product = products.find(p => p.id == productId);
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${product.name} has been added to your cart.`);
        updateCartUI();
    }

    function updateCartUI() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const cartTotalPriceElement = document.getElementById('cart-total-price');
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = '';
            let totalPrice = 0;
            cart.forEach(item => {
                totalPrice += item.price;
                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-item');
                cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <h3>${item.name}</h3>
                    <p>Price: $${item.price}</p>
                    <button data-id="${item.id}" class="remove-btn">Remove</button>
                `;
                cartItemsContainer.appendChild(cartItem);
            });
            cartTotalPriceElement.textContent = totalPrice.toFixed(2);

            const removeButtons = document.querySelectorAll('.remove-btn');
            removeButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    const productId = e.target.getAttribute('data-id');
                    removeFromCart(productId);
                });
            });
        }
    }

    function removeFromCart(productId) {
        const productIndex = cart.findIndex(p => p.id == productId);
        if (productIndex > -1) {
            const removedProduct = cart.splice(productIndex, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            alert(`${removedProduct[0].name} has been removed from your cart.`);
            updateCartUI();
        }
    }

    if (document.querySelector('.checkout-btn')) {
        document.querySelector('.checkout-btn').addEventListener('click', () => {
            alert('Proceeding to checkout...');
            localStorage.removeItem('cart');
            window.location.href = 'checkout.html';
        });
    }

    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const cardNumber = document.getElementById('card-number').value;
            const expiryDate = document.getElementById('expiry-date').value;
            const cvv = document.getElementById('cvv').value;

            if (validateForm(name, cardNumber, expiryDate, cvv)) {
                alert('Payment successful! Thank you for your purchase.');
                document.getElementById('form-message').textContent = 'Payment successful! Thank you for your purchase.';
                checkoutForm.reset();
                localStorage.removeItem('cart');
            } else {
                alert('Please fill out all fields correctly.');
                document.getElementById('form-message').textContent = 'Please fill out all fields correctly.';
            }
        });
    }

    function validateForm(name, cardNumber, expiryDate, cvv) {
        const cardNumberRegex = /^[0-9]{16}$/;
        const expiryDateRegex = /^(0[1-9]|1[0-2])\/[0-9]{2}$/;
        const cvvRegex = /^[0-9]{3}$/;

        return name !== '' && cardNumberRegex.test(cardNumber) && expiryDateRegex.test(expiryDate) && cvvRegex.test(cvv);
    }

    updateCartUI();
});
