import { orders } from "../data/orders.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { cart } from "../data/cart-class.js";

updateQuantity()

const url = new URL(window.location.href)
url.searchParams.get('orderId');
url.searchParams.get('productId')
let progress = '';

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
                    //orderTime = order.orderTime
                }
            })
        }
        //orderTime = order.orderTime
    })
    let currentTime = dayjs();
    const deliveryDate = dayjs(matchingProduct.estimatedDeliveryTime);
    const orderTime = dayjs(orderFromOrders.orderTime)
    progress = ((currentTime - orderTime)/(deliveryDate-orderTime))*100;
    progress =  Math.round(progress);
    let deliveryDay = deliveryDate.format('dddd, MMMM D');
    html += `
            <a class="back-to-orders-link link-primary" href="orders.html">
             View all orders
            </a>
            <div class="delivery-date">
            <span class="js-order-arrival">Arriving</span> on ${deliveryDay}
            </div>

            <div class="product-info">
            ${matchingItem.name}
            </div>

            <div class="product-info">
            Quantity: ${matchingProduct.quantity}
            </div>

            <img class="product-image" src="${matchingItem.image}"></img>
            <div class="progress-labels-container" >
            <div class="progress-label js-preparing">
                Preparing
            </div>
            <div class="progress-label js-shipped">
                Shipped
            </div>
            <div class="progress-label js-delivered">
                Delivered
            </div>
            </div>

            <div class="progress-bar-container">
            <div class="progress-bar js-progress-bar"></div>
            </div>
        `;
        document.querySelector('.js-order-tracking').innerHTML = html
        document.querySelector('.js-progress-bar').style.width = `${progress}%`

        if (progress >= 0 && progress<=49){
            document.querySelector('.js-preparing').classList.add('current-status')
        }
        else if (progress > 49 && progress<=99){
            document.querySelector('.js-shipped').classList.add('current-status')
        }
        else if (progress >= 100){
            document.querySelector('.js-delivered').classList.add('current-status')
            document.querySelector('.js-order-arrival').innerHTML = 'Delivered'
        }
}
renderHTML();

function updateQuantity(){
    let quantity = cart.calculateCartQuantity();
    document.querySelector('.js-cart-quantity').innerHTML = quantity;
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