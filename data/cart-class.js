class Cart{
  cartItems;
  #localStorageKey;

  constructor (localStorageKey){
      this.#localStorageKey = localStorageKey;
      //businessCart.localStorageKey = 'cart-business'

      this.#loadFromStorage();
      //businessCart.loadFromStorage();
  }

  #loadFromStorage(){
      this.cartItems =JSON.parse(localStorage.getItem(this.#localStorageKey))|| [{
          productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
          quantity:2,
          deliveryOptionId: '1'
      },{
          productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
          quantity:1,
          deliveryOptionId: '2'
      }];
  }

  saveToStorage (){
      localStorage.setItem(this.#localStorageKey,JSON.stringify(this.cartItems))
  }

  calculateCartQuantity(){
    let cartQuantity = 0;
  
    this.cartItems.forEach(item=>{
    cartQuantity += item.quantity;
    });
  
    return cartQuantity;
  }

  addToCart(productId){
      let matchingItem;
    
      this.cartItems.forEach(item=>{
          if(productId === item.productId){
              matchingItem = item;
          }
      });
    
      if(matchingItem){
          matchingItem.quantity++;
      }
      else{
          this.cartItems.push({
              productId: productId,
              quantity: 1,
              deliveryOptionId: '1'
          });
      }
      this.saveToStorage();
  }

  removeFromCart(productId){
      const newCart = [];
  
      this.cartItems.forEach(cartItem =>{
          if (cartItem.productId !== productId){
              newCart.push(cartItem);
          }
      })
  
      this.cartItems = newCart;
      this.saveToStorage();
  }

  updateQuantity(productId, newQuantity){
    let matchingProduct;
    let updatedQuantity = 0;
  
    this.cartItems.forEach(cartItem =>{
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
    this.saveToStorage();
    document.querySelector(`.js-quantity-label-${productId}`).innerHTML = updatedQuantity;
  }

  updateDeliveryOption(productId, deliveryOptionId){
      let matchingItem;
    
      this.cartItems.forEach(item=>{
          if(productId === item.productId){
              matchingItem = item;
          }
      });
  
      matchingItem.deliveryOptionId = deliveryOptionId;
  
      this.saveToStorage();
  }

  loadCart(fun){
    const xhr = new XMLHttpRequest();
  
    xhr.addEventListener('load',()=>{
        console.log(xhr.response)

      fun();
    })
    xhr.open('GET','https://supersimplebackend.dev/cart');
    xhr.send();
  }
}

export const cart =new Cart('cart');