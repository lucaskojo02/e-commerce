export const cart = [];

export function addToCart(productId){
    let quantity = document.querySelector(`.js-quantity-selector-${productId}`).value;
      
    quantity = Number(quantity);
  
    let matchingItem;
    
    cart.forEach(item=>{
      if (productId === item.productId){
        matchingItem = item;
      }
    })
  
    if (matchingItem){
      matchingItem.quantity+=quantity;
    }
    else{
      cart.push({productId,quantity})
    }
  }