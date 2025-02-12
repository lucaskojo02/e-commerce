import { calculateCartQuantity } from "../../data/cart.js";

export function renderCheckoutHeader(){
    let quantity = calculateCartQuantity()
     document.querySelector('.js-update-quantity').innerHTML = `${quantity} items`
}