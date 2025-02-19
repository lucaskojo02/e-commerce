import { orders} from "../data/orders.js";
import { cart } from "../data/cart-class.js";
import { formatCurrency } from "./utils/money.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

updateQuantity();
export function updateQuantity(){
    let quantity = cart.calculateCartQuantity();
    document.querySelector('.js-cart-quantity').innerHTML = quantity;
}

async function renderOrder(){
    let headerHTML =''
    let matchingItem = '';

    const response = await fetch('https://supersimplebackend.dev/products');
    const productsData = await response.json();
    orders.forEach(order=>{
        let html ='';
        order.products.forEach(product=>{
            productsData.map((productDetails)=>{
                if (productDetails.id === product.productId){
                    matchingItem = productDetails;
                }
            });
            const deliveryTime = product.estimatedDeliveryTime
            let deliveryDate = dayjs(deliveryTime);
            
            
            deliveryDate = deliveryDate.format('MMMM D');
            
            html+=`
                <div class="product-image-container">
                    <img src="${matchingItem.image}">
                </div>

                <div class="product-details">
                    <div class="product-name">
                    ${matchingItem.name}
                    </div>
                    <div class="product-delivery-date">
                    <span class="js-order-arrival">Arriving</span> on: ${deliveryDate}
                    </div>
                    <div class="product-quantity">
                    Quantity: ${product.quantity}
                    </div>
                    <button class="buy-again-button button-primary js-buy-again-button" data-product-id = "${product.productId}">
                    <img class="buy-again-icon" src="images/icons/buy-again.png">
                    <span class="buy-again-message">Buy it again</span>
                    </button>
                </div>

                <div class="product-actions">
                    <a href="tracking.html?orderId=${order.id}&productId=${product.productId}">
                    <button class="track-package-button button-secondary">
                        Track package
                    </button>
                    </a>
                </div>
            `;
        })
        const date = order.orderTime
        const today = dayjs(date);
        const orderDay = today.format('MMMM D')
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
        <div class="order-details-grid">
        ${html}
        </div>
        </div>
        `;
    })
    document.querySelector('.js-orders-grid').innerHTML = headerHTML;

    orders.forEach(order=>{
        order.products.forEach(product=>{
            const deliveryDay = dayjs(product.estimatedDeliveryTime)
            const currentTime = dayjs();
            
            if ((currentTime - deliveryDay)>=0){
                document.querySelector('.js-order-arrival').innerHTML = 'Delivered'
            }
        })
    })
    
    document.querySelectorAll('.js-buy-again-button').forEach(button=>{
        button.addEventListener('click',()=>{
            const productId = button.getAttribute('data-product-id')
            cart.buyAgain(productId);
            updateQuantity();
        })
    })
}

renderOrder();