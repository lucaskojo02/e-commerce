import { products } from '../../data/products.js'
import {cart, removeFromCart, updateQuantity, updateDeliveryOption} from '../../data/cart.js';
import { formatCurrency } from './../utils/money.js';
import { deliveryOptions } from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';
import { renderCheckoutHeader } from './checkoutHeader.js';
import { calculateDeliveryDate } from '../../data/deliveryOptions.js';

export function renderOrderSummary(){
    let summaryHTML = '';

    cart.forEach(cartItem=>{
        const productId = cartItem.productId;
        let matchingProduct = '';

        const deliveryOptionId = cartItem.deliveryOptionId

        products.forEach(product=>{
            if (product.id === productId){
                matchingProduct = product;
            }
        })

        let deliveryOption;

        deliveryOptions.forEach(option=>{
            if (option.id === deliveryOptionId){
                deliveryOption = option;
            }
        })

        const dateString = calculateDeliveryDate(deliveryOption);
        
        summaryHTML += `
        <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
            <div class="delivery-date">
                Delivery date: ${dateString}
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

                    ${deliveryOptionsHTML(matchingProduct, cartItem)}
                
                </div>
            </div>
            </div>
        `;
        document.querySelector('.js-order-summary').innerHTML = summaryHTML;
    })

    function deliveryOptionsHTML(matchingProduct, cartItem){
        let html='';

        deliveryOptions.forEach(deliveryOption =>{

            const dateString = calculateDeliveryDate(deliveryOption);

            const priceString = deliveryOption.priceCents === 0?'FREE' :`$${formatCurrency(deliveryOption.priceCents)}`;

            const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

            html += `
            <div class="delivery-option js-delivery-option" data-product-id="${matchingProduct.id}" data-delivery-option-id="${deliveryOption.id}">
                    <input type="radio"
                    ${isChecked ? 'checked' : ''}
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                    <div>
                    <div class="delivery-option-date">
                        ${dateString}
                    </div>
                    <div class="delivery-option-price">
                        ${priceString} - Shipping
                    </div>
                    </div>
                </div>
            `
        });
        return html;

    }
    document.querySelectorAll('.js-delivery-option').forEach(element=>{
        element.addEventListener('click',()=>{
            const productId = element.getAttribute('data-product-id');
            const deliveryOptionId = element.getAttribute('data-delivery-option-id');
            updateDeliveryOption(productId,deliveryOptionId);
            renderOrderSummary();
            renderPaymentSummary();
        })
    })

    document.querySelectorAll('.js-delete-link').forEach(link=>{
        link.addEventListener('click',()=>{
            const productId = link.getAttribute('data-product-id');

            removeFromCart(productId);

            const container = document.querySelector(`.js-cart-item-container-${productId}`);
            container.remove();

            renderCheckoutHeader();
            renderPaymentSummary();
            //renderOrderSummary();
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

           renderCheckoutHeader();
           renderPaymentSummary();

            document.querySelector(`.js-quantity-input-${productId}`).value = '';
        })
    })
}