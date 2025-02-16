import { cart } from "../../data/cart-class.js";

export function renderCheckoutHeader(){
    let quantity = cart.calculateCartQuantity()
     document.querySelector('.js-update-quantity').innerHTML = `${quantity} items`
}