import { products } from '../data/products.js'
import {cart, removeFromCart, calculateCartQuantity, updateQuantity} from '../data/cart.js';
import { formatCurrency } from './utils/money.js';

let summaryHTML = '';

cart.forEach(cartItem=>{
    const productId = cartItem.productId;
    let matchingProduct = '';

    products.forEach(product=>{
        if (product.id === productId){
            matchingProduct = product;
        }
    })
    
    summaryHTML += `
      <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
            Delivery date: Tuesday, June 21
        </div>

        <div class="cart-item-details-grid">
            <img class="product-image"
            src="${matchingProduct.image}">

            <div class="cart-item-details">
            <div class="product-name">
                ${matchingProduct.name}
            </div>
            <div class="product-price">
                $${formatCurrency(matchingProduct.priceCents)}
            </div>
            <div class="product-quantity">
                <span>
                Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
                </span>
                <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
                Update
                </span>
                <div class="js-edit-quantity">
                  <input type="number" class="quantity-input js-quantity-input-${matchingProduct.id}" min = "0"  max = "1000">
                  <span class="save-quantity-link link-primary js-save-quantity-link" data-product-id="${matchingProduct.id}">Save</span>
                </div>
                <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
                Delete
                </span>
            </div>
            </div>

            <div class="delivery-options">
            <div class="delivery-options-title">
                Choose a delivery option:
            </div>
            <div class="delivery-option">
                <input type="radio" checked
                class="delivery-option-input"
                name="delivery-option-${matchingProduct.id}">
                <div>
                <div class="delivery-option-date">
                    Tuesday, June 21
                </div>
                <div class="delivery-option-price">
                    FREE Shipping
                </div>
                </div>
            </div>
            <div class="delivery-option">
                <input type="radio"
                class="delivery-option-input"
                name="delivery-option-${matchingProduct.id}">
                <div>
                <div class="delivery-option-date">
                    Wednesday, June 15
                </div>
                <div class="delivery-option-price">
                    $4.99 - Shipping
                </div>
                </div>
            </div>
            <div class="delivery-option">
                <input type="radio"
                class="delivery-option-input"
                name="delivery-option-${matchingProduct.id}">
                <div>
                <div class="delivery-option-date">
                    Monday, June 13
                </div>
                <div class="delivery-option-price">
                    $9.99 - Shipping
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>
    `
    function displayUpdateQuantity(){
        let quantity = calculateCartQuantity();

        document.querySelector('.js-update-quantity').innerHTML = `${quantity} items`
    }

    displayUpdateQuantity();

    document.querySelector('.js-order-summary').innerHTML = summaryHTML;

    document.querySelectorAll('.js-delete-link').forEach(link=>{
        link.addEventListener('click',()=>{
            const productId = link.getAttribute('data-product-id');

            removeFromCart(productId);

            const container = document.querySelector(`.js-cart-item-container-${productId}`);

            displayUpdateQuantity();

            container.remove();
        });
    })

    document.querySelectorAll('.js-update-link').forEach(link=>{
        link.addEventListener('click',()=>{
            const productId = link.getAttribute("data-product-id")
            
            const container = document.querySelector(`.js-cart-item-container-${productId}`)

            container.classList.add('is-editing-quantity');

            document.querySelector(`.js-quantity-label-${productId}`).classList.add('js-quantity-label')
        })
    })

    document.querySelectorAll('.js-save-quantity-link').forEach(saveLink=>{
        saveLink.addEventListener('click',()=>{
            const productId = saveLink.getAttribute("data-product-id")
    
            const container = document.querySelector(`.js-cart-item-container-${productId}`)
    
            container.classList.remove('is-editing-quantity');

            let newQuantity = document.querySelector(`.js-quantity-input-${productId}`).value;

            newQuantity = Number(newQuantity);

            updateQuantity(productId,newQuantity);

            displayUpdateQuantity();

            document.querySelector(`.js-quantity-input-${productId}`).value = '';
        })
    })
})