import { orders } from "../data/orders.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js'


const url = new URL(window.location.href)
url.searchParams.get('orderId');
url.searchParams.get('productId')

async function renderHTML(){
    let html = ''
    let matchingItem = '';
    let matchingProduct = '';
    const orderId = url.searchParams.get('orderId');
    const productId = url.searchParams.get('productId')
    let orderFromOrders ='';

    const response = await fetch('https://supersimplebackend.dev/products');
    const productsData = await response.json();
    productsData.map(productDetails=>{
        if (productDetails.id === productId){
            matchingItem = productDetails;
        }
    });

    orders.forEach(order=>{
        if (order.id === orderId){
            orderFromOrders = order;
            order.products.forEach(product=>{
                if (productId === product.productId){
                    matchingProduct = product
                }
            })
        }
    })
    const deliveryDate = dayjs(matchingProduct.estimatedDeliveryTime);
    let deliveryDay = deliveryDate.format('dddd, MMMM D');
    html += `
            <a class="back-to-orders-link link-primary" href="orders.html">
             View all orders
            </a>
            <div class="delivery-date">
            Arriving on ${deliveryDay}
            </div>

            <div class="product-info">
            ${matchingItem.name}
            </div>

            <div class="product-info">
            Quantity: ${matchingProduct.quantity}
            </div>

            <img class="product-image" src="${matchingItem.image}"></img>
            <div class="progress-labels-container">
            <div class="progress-label">
                Preparing
            </div>
            <div class="progress-label current-status">
                Shipped
            </div>
            <div class="progress-label">
                Delivered
            </div>
            </div>

            <div class="progress-bar-container">
            <div class="progress-bar"></div>
            </div>
        `;
        document.querySelector('.js-order-tracking').innerHTML = html
}
renderHTML();
/*<div class="delivery-date">
          Arriving on Monday, June 13
        </div>

        <div class="product-info">
          Black and Gray Athletic Cotton Socks - 6 Pairs
        </div>

        <div class="product-info">
          Quantity: 1
        </div>

        <img class="product-image" src="images/products/athletic-cotton-socks-6-pairs.jpg"></img>*/