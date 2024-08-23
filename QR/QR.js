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
    { name: 'Caesar Salad', cost: 5 },
    { name: 'Grilled Steak', cost: 9 },
    { name: 'Pasta Carbonara', cost: 7 },
    { name: 'Grilled Leg pcs', cost: 6 },
    { name: 'Special Thali', cost: 10 },
    { name: 'Our Special Dosa', cost: 6 },
    { name: 'Grilled Fish', cost: 7 },
    { name: 'Chicken Bharta', cost: 5 },
    { name: 'Butter Naan', cost: 2 },
    { name: 'Tutty Fruity', cost: 4 },
    { name: 'Firni', cost: 4 },
];

let cart = [];

// Simulate data.json object for storing orders
let ordersData = [];

scanBtn.addEventListener('click', () => {
    cameraView.classList.remove('hidden');
    const html5QrCode = new Html5Qrcode("reader");

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
        dateTime: formattedDateTime,
        status: "Food is preparing"
    };

    saveOrderToLocalStorage(orderDetails);

    // Show the preparing message
    messageDiv.classList.remove('hidden');
    messageDiv.textContent = 'Your food is preparing!';

    // After 5 seconds, remove the preparing message and update order status
    setTimeout(() => {
        messageDiv.classList.add('hidden');
        updateOrderInLocalStorage(orderDetails);
        notifyUserFoodReady(orderDetails);
    }, 5000);

    cart = [];
    updateCart();
});

function saveOrderToLocalStorage(orderDetails) {
    ordersData.push(orderDetails);
    localStorage.setItem('orders', JSON.stringify(ordersData));
}

function updateOrderInLocalStorage(orderDetails) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const orderIndex = orders.findIndex(order => order.table === orderDetails.table && order.dateTime === orderDetails.dateTime);
    if (orderIndex !== -1) {
        orders[orderIndex].status = "Food is ready!";
        localStorage.setItem('orders', JSON.stringify(orders));
    }
}

function notifyUserFoodReady(orderDetails) {
    messageDiv.classList.remove('hidden');
    messageDiv.textContent = 'Your food is ready!';

    // Show this in the View Orders section too
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orderHistory.innerHTML = '';
    orders.forEach((order, index) => {
        orderHistory.innerHTML += `
            <div>
                <strong>Order ${index + 1}:</strong>
                <p>Table: ${order.table}</p>
                <p>Date & Time: ${order.dateTime}</p>
                <p>Total: $${order.total}</p>
                <p>Status: ${order.status}</p>
                <ul>
                    ${order.items.map(item => `<li>${item.name} - $${item.cost}</li>`).join('')}
                </ul>
            </div>
            <hr>
        `;
    });
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
                <p>Status: ${order.status}</p>
                <ul>
                    ${order.items.map(item => `<li>${item.name} - $${item.cost}</li>`).join('')}
                </ul>
            </div>
            <hr>
        `;
    });
});
