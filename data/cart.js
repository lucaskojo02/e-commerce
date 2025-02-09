export let cart = JSON.parse(localStorage.getItem('cart'));

if (!cart){[{
  productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
  quantity: 2
},{
  productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
  quantity:1
}];
}

function saveToStorage(){
  localStorage.setItem('cart', JSON.stringify(cart))
}

export function calculateCartQuantity(){
  let cartQuantity = 0;

  cart.forEach(item=>{
  cartQuantity += item.quantity;
  });

  return cartQuantity;
}

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

    saveToStorage();
}
export function removeFromCart(productId){
  const newCart = [];

  cart.forEach(cartItem=>{
    if (cartItem.productId !== productId){
      newCart.push(cartItem);
    }
  })
  cart = newCart;

  saveToStorage();
  
}

export function updateQuantity(productId, newQuantity){
  let matchingProduct;
  let updatedQuantity = 0;

  cart.forEach(cartItem =>{
    if (cartItem.productId === productId){
      matchingProduct = cartItem;
      if (newQuantity < 0){
        newQuantity = 0;
        matchingProduct.quantity += newQuantity;
      }
      else if (newQuantity > 1000){
        newQuantity = 999;
        matchingProduct.quantity += newQuantity;
      }
      else{
        matchingProduct.quantity += newQuantity;
      }
      updatedQuantity = matchingProduct.quantity;
    }
  })
  saveToStorage();
  document.querySelector(`.js-quantity-label-${productId}`).innerHTML = updatedQuantity;
}