import { orders} from "../data/orders.js";
import { cart } from "../data/cart-class.js";
import { formatCurrency } from "./utils/money.js";
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

updateQuantity();
export function updateQuantity(){
    let quantity = cart.calculateCartQuantity();
    document.querySelector('.js-cart-quantity').innerHTML = quantity;
}

async function renderOrder() {
    let headerHTML = '';

    const response = await fetch('https://supersimplebackend.dev/products');
    const productsData = await response.json();

    orders.forEach(order => {
        let html = '';

        order.products.forEach(product => {
            const matchingItem = productsData.find(p => p.id === product.productId);
            if (!matchingItem) return;

            const deliveryDate = dayjs(product.estimatedDeliveryTime).format('MMMM D');

            html += `
                <div class="product-image-container">
                    <img src="${matchingItem.image}">
                </div>

                <div class="product-details">
                    <div class="product-name">${matchingItem.name}</div>
                    <div class="product-delivery-date js-product-delivery-date" data-product-id="${product.productId}" data-order-id="${order.id}">
                        <span class="js-order-arrival">Arriving</span> on: ${deliveryDate}
                    </div>
                    <div class="product-quantity">Quantity: ${product.quantity}</div>
                    <button class="buy-again-button button-primary js-buy-again-button" data-product-id="${product.productId}">
                        <img class="buy-again-icon" src="images/icons/buy-again.png">
                        <span class="buy-again-message">Buy it again</span>
                    </button>
                </div>

                <div class="product-actions">
                    <a href="tracking.html?orderId=${order.id}&productId=${product.productId}">
                        <button class="track-package-button button-secondary">Track package</button>
                    </a>
                </div>
            `;
        });

        const orderDay = dayjs(order.orderTime).format('MMMM D');
        headerHTML += `
            <div class="order-container">
                <div class="order-header">
                    <div class="order-header-left-section">
                        <div class="order-date">
                            <div class="order-header-label">Order Placed:</div>
                            <div>${orderDay}</div>
                        </div>
                        <div class="order-total">
                            <div class="order-header-label">Total:</div>
                            <div>$${formatCurrency(order.totalCostCents)}</div>
                        </div>
                    </div>
                    <div class="order-header-right-section">
                        <div class="order-header-label">Order ID:</div>
                        <div>${order.id}</div>
                    </div>
                </div>
                <div class="order-details-grid">${html}</div>
            </div>
        `;
    });

    document.querySelector('.js-orders-grid').innerHTML = headerHTML;

    // Check delivery status after rendering orders
    checkDeliveryStatus();

    // Handle Buy Again button click
    document.querySelectorAll('.js-buy-again-button').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-product-id');
            cart.buyAgain(productId);
            updateQuantity();
        });
    });
}

renderOrder();

async function checkDeliveryStatus() {
    document.querySelectorAll('.js-product-delivery-date').forEach(orderArrival => {
        const productId = orderArrival.getAttribute('data-product-id');
        const orderId = orderArrival.getAttribute('data-order-id'); //Track the order ID

        orders.forEach(order => {
            if (order.id !== orderId) return; //Ensure only the correct order is checked

            order.products.forEach(product => {
                const deliveryDay = dayjs(product.estimatedDeliveryTime);
                const currentTime = dayjs();

                // Ensure correct product AND order is checked
                if (product.productId === productId && order.id === orderId) {
                    if (currentTime.isAfter(deliveryDay)) {  //Only updates if delivery date is passed
                        const arrivalSpan = orderArrival.querySelector('.js-order-arrival');
                        if (arrivalSpan) {
                            arrivalSpan.innerHTML = 'Delivered';  // Only updates delivered products
                        }
                    }
                }
            });
        });
    });
}

function saveSearchItem() {
    const searchButton = document.querySelector('.js-search-button');

    searchButton.addEventListener('click', () => {
        let inputValue = document.querySelector('.js-search-bar').value.trim();
        
        if (inputValue) {
            let newURL = `amazon.html?search=${encodeURIComponent(inputValue)}`;
            window.location.href = newURL;
        }
    });
}

saveSearchItem();

document.querySelector('.js-search-bar').addEventListener('keydown',event=>{
    if (event.key === 'Enter'){
      event.preventDefault();
      let inputValue = document.querySelector('.js-search-bar').value.trim();
      
      if (inputValue) {
          let newURL = `amazon.html?search=${encodeURIComponent(inputValue)}`;
          window.location.href = newURL; // Update URL and reload the page
      }
    }
  })