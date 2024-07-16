document.addEventListener('DOMContentLoaded', () => {
    initializeCart();
});

function initializeCart() {
    const removeCartItemButtons = document.querySelectorAll('.btn-danger');
    removeCartItemButtons.forEach(button => {
        button.addEventListener('click', removeCartItem);
    });

    const quantityInputs = document.querySelectorAll('.cart-quantity-input');
    quantityInputs.forEach(input => {
        input.addEventListener('change', quantityChanged);
    });

    const addToCartButtons = document.querySelectorAll('.shop-item-button');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCartClicked);
    });

    document.querySelector('.btn-purchase').addEventListener('click', purchaseClicked);

    loadCart(); // Load cart when initializing
}

function purchaseClicked() {
    window.location.href = 'checkout.html';
    updateCartTotal();
    saveCart(); // Save cart after purchase (which clears the cart)
}

function removeCartItem(event) {
    const buttonClicked = event.target;
    buttonClicked.closest('.cart-row').remove();
    updateCartTotal();
    saveCart(); // Save cart after removing item
}

function quantityChanged(event) {
    const input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updateCartTotal();
    saveCart(); // Save cart after quantity change
}

function addToCartClicked(event) {
    const button = event.target;
    let shopItem = button.closest('.product');
    if (!shopItem) {
        shopItem = button.closest('.arrival');
    }
    
    const title = shopItem.querySelector('h3') ? shopItem.querySelector('h3').innerText : shopItem.querySelector('h1').innerText;
    const priceElement = shopItem.querySelector('.shop-item-price') || shopItem.querySelector('.btn__group button');
    const price = priceElement.innerText;
    const imageSrc = shopItem.querySelector('img').src;
    
    addItemToCart(title, price, imageSrc);
    updateCartTotal();
}

function addItemToCart(title, price, imageSrc, quantity = 1) {
    const cartItems = document.querySelector('.cart-items');
    const cartItemNames = cartItems.querySelectorAll('.cart-item-title');
    for (let i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText === title) {
            alert('ეს ნივთი უკვე დამატებულია კალათაში');
            return;
        }
    }

    const cartRow = document.createElement('div');
    cartRow.classList.add('cart-row');
    const cartRowContents = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="${quantity}">
            <button class="btn btn-danger" type="button">წაშლა</button>
        </div>`;
    cartRow.innerHTML = cartRowContents;
    cartItems.append(cartRow);
    cartRow.querySelector('.btn-danger').addEventListener('click', removeCartItem);
    cartRow.querySelector('.cart-quantity-input').addEventListener('change', quantityChanged);
    saveCart(); // Save cart after adding item
}

function updateCartTotal() {
    const cartItemContainer = document.querySelector('.cart-items');
    const cartRows = cartItemContainer.querySelectorAll('.cart-row');
    let total = 0;
    cartRows.forEach(cartRow => {
        const priceElement = cartRow.querySelector('.cart-price');
        const quantityElement = cartRow.querySelector('.cart-quantity-input');
        const price = parseFloat(priceElement.innerText.replace('₾', '').replace('$', ''));
        const quantity = quantityElement.value;
        total += price * quantity;
    });
    total = Math.round(total * 100) / 100;
    document.querySelector('.cart-total-price').innerText = '₾' + total;
    saveCart(); // Save cart after updating total
}

function saveCart() {
    const cartItems = document.querySelector('.cart-items');
    const cartItemsData = [];
    cartItems.querySelectorAll('.cart-row').forEach(row => {
        const title = row.querySelector('.cart-item-title').innerText;
        const price = row.querySelector('.cart-price').innerText;
        const quantity = row.querySelector('.cart-quantity-input').value;
        const imageSrc = row.querySelector('.cart-item-image').src;
        cartItemsData.push({ title, price, quantity, imageSrc });
    });
    localStorage.setItem('cartItems', JSON.stringify(cartItemsData));
}

function loadCart() {
    const cartItemsData = JSON.parse(localStorage.getItem('cartItems')) || [];
    cartItemsData.forEach(item => {
        addItemToCart(item.title, item.price, item.imageSrc, item.quantity);
    });
    updateCartTotal();
}