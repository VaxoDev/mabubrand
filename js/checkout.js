document.addEventListener('DOMContentLoaded', () => {
    loadCheckoutItems();
    document.getElementById('checkout-form').addEventListener('submit', completeOrder);
});

function loadCheckoutItems() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    let subtotal = 0;

    if (cartItems.length === 0) {
        // Cart is empty
        cartItemsContainer.innerHTML = '<p>კალათა ცარიელია</p>';
        document.getElementById('subtotal').textContent = '₾0.00';
        document.getElementById('delivery-price').textContent = '₾0.00';
        document.getElementById('total-price').textContent = '₾0.00';
        document.getElementById('delivery-time').textContent = 'არ არის ხელმისაწვდომი';
        return; // Exit the function early
    }

    cartItemsContainer.innerHTML = ''; // Clear existing items

    cartItems.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
            <img src="${item.imageSrc}" alt="${item.title}" width="50" height="50">
            <span>${item.title} x${item.quantity}</span>
            <span>${item.price}</span>
            <button class="remove-item" data-index="${index}">წაშლა</button>
        `;
        cartItemsContainer.appendChild(itemElement);

        subtotal += parseFloat(item.price.replace('₾', '')) * parseInt(item.quantity);
    });

    // Add event listeners for remove buttons
    const removeButtons = document.querySelectorAll('.remove-item');
    removeButtons.forEach(button => {
        button.addEventListener('click', removeItem);
    });

    const deliveryPrice = 5; // Assuming a flat delivery fee of 5 GEL
    const total = subtotal + deliveryPrice;

    document.getElementById('subtotal').textContent = '₾' + subtotal.toFixed(2);
    document.getElementById('delivery-price').textContent = '₾' + deliveryPrice.toFixed(2);
    document.getElementById('total-price').textContent = '₾' + total.toFixed(2);

    // Calculate estimated delivery time (e.g., 7 days from now)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7);

    const georgianMonths = [
        'იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი',
        'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი'
    ];

    const georgianDays = [
        'კვირა', 'ორშაბათი', 'სამშაბათი', 'ოთხშაბათი', 'ხუთშაბათი', 'პარასკევი', 'შაბათი'
    ];

    const georgianDate = `${georgianDays[deliveryDate.getDay()]}, ${deliveryDate.getFullYear()} წლის ${deliveryDate.getDate()} ${georgianMonths[deliveryDate.getMonth()]}`;

    document.getElementById('delivery-time').textContent = georgianDate;
}

function removeItem(event) {
    const index = event.target.dataset.index;
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    cartItems.splice(index, 1);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    loadCheckoutItems(); // Reload the items
}