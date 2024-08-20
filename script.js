const scanBtn = document.getElementById('scanBtn');
const cameraView = document.getElementById('cameraView');
const orderingSystem = document.getElementById('orderingSystem');
const orderNowBtn = document.getElementById('orderNowBtn');
const foodMenu = document.getElementById('foodMenu');
const foodList = document.getElementById('foodList');
const cartItems = document.getElementById('cartItems');
const totalAmount = document.getElementById('totalAmount');
const bookNowBtn = document.getElementById('bookNowBtn');
const tableNumberDropdown = document.getElementById('tableNumber');
const viewOrdersBtn = document.getElementById('viewOrdersBtn');
const orderHistory = document.getElementById('orderHistory');
const messageDiv = document.getElementById('message');

const foodItems = [
    { name: 'Burger', cost: 5 },
    { name: 'Pizza', cost: 8 },
    { name: 'Pasta', cost: 7 },
    { name: 'Salad', cost: 4 }
];

let cart = [];

scanBtn.addEventListener('click', () => {
    cameraView.classList.remove('hidden');
    //  html5QrCode = new html5QrCode("reader");
     var html5QrCode = new Html5Qrcode("reader");


    html5QrCode.start(
        { facingMode: "environment" },
        {
            fps: 10,
            qrbox: 250
        },
        (decodedText, decodedResult) => {
            html5QrCode.stop();
            cameraView.classList.add('hidden');
            orderingSystem.classList.remove('hidden');
        },
        (errorMessage) => {
            // Handle errors
        }
    ).catch((err) => {
        console.error("Failed to start QR code scanning: ", err);
    });
});

orderNowBtn.addEventListener('click', () => {
    const tableNumber = tableNumberDropdown.value;

    if (!tableNumber) {
        alert('Please select a table number.');
        return;
    }

    foodMenu.classList.remove('hidden');
    foodList.innerHTML = '';

    foodItems.forEach((item, index) => {
        const foodItemDiv = document.createElement('div');
        foodItemDiv.className = 'food-item';
        foodItemDiv.innerHTML = `
            <span>${item.name} - $${item.cost}</span>
            <button onclick="addToCart(${index})">+</button>
        `;
        foodList.appendChild(foodItemDiv);
    });
});

function addToCart(index) {
    const item = foodItems[index];
    cart.push(item);
    updateCart();
}

function updateCart() {
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach((item) => {
        total += item.cost;
        cartItems.innerHTML += `<div>${item.name} - $${item.cost}</div>`;
    });
    totalAmount.textContent = total;
    bookNowBtn.classList.remove('hidden');
}

bookNowBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty. Please add items to the cart before placing an order.');
        return;
    }

    const tableNumber = tableNumberDropdown.value;

    if (!tableNumber) {
        alert('Please select a table number.');
        return;
    }

    const currentDateTime = new Date();
    const formattedDateTime = `${currentDateTime.toLocaleDateString()} ${currentDateTime.toLocaleTimeString()}`;

    alert('Order booked successfully! Your food is preparing.');
    
    const orderDetails = {
        table: tableNumber,
        items: cart,
        total: totalAmount.textContent,
        dateTime: formattedDateTime
    };

    saveOrderToLocalStorage(orderDetails);

    setTimeout(() => {
        cart = [];
        updateCart();
        bookNowBtn.classList.add('hidden');
        messageDiv.classList.remove('hidden');
        messageDiv.textContent = 'Your food is ready!';
        notifyUserFoodReady(orderDetails);
    }, 5000);
});

function saveOrderToLocalStorage(orderDetails) {
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(orderDetails);
    localStorage.setItem('orders', JSON.stringify(orders));
}

function notifyUserFoodReady(orderDetails) {
    alert(`Notification: Food for table ${orderDetails.table} is ready!`);
}

viewOrdersBtn.addEventListener('click', () => {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orderHistory.innerHTML = '';

    if (orders.length === 0) {
        orderHistory.innerHTML = 'No orders found.';
        return;
    }

    orders.forEach((order, index) => {
        orderHistory.innerHTML += `
            <div>
                <strong>Order ${index + 1}:</strong>
                <p>Table: ${order.table}</p>
                <p>Date & Time: ${order.dateTime}</p>
                <p>Total: $${order.total}</p>
                <ul>
                    ${order.items.map(item => `<li>${item.name} - $${item.cost}</li>`).join('')}
                </ul>
            </div>
            <hr>
        `;
    });
});
