import { cart } from "../data/cart-class.js";
import { products, loadProducts } from "../data/products.js";

loadProducts(renderProductsGrid)

function renderProductsGrid(){
  let productsHTML = '';

  updateCartQuantity();

  products.forEach(product=>{
      productsHTML +=`
      <div class="product-container">
            <div class="product-image-container">
              <img class="product-image"
                src="${product.image}">
            </div>

            <div class="product-name limit-text-to-2-lines">
              ${product.name}
            </div>

            <div class="product-rating-container">
              <img class="product-rating-stars"
                src="${product.getStarsUrl()}">
              <div class="product-rating-count link-primary">
                ${product.rating.count}
              </div>
            </div>

            <div class="product-price">
              ${product.getPrice()}
            </div>

            <div class="product-quantity-container">
              <select class="js-quantity-selector-${product.id}">
                <option selected value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
              </select>
            </div>

            ${product.extraInfoHTML()}
            <div class="product-spacer"></div>

            <div class="added-to-cart js-added-${product.id}">
              <img src="images/icons/checkmark.png">
              Added
            </div>

            <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
              Add to Cart
            </button>
          </div>
      `;
  });

  document.querySelector('.js-products-grid').innerHTML = productsHTML;

  let timeOut = {};


  function displayAddedToCartText(productId){
    const addedDisplay = document.querySelector(`.js-added-${productId}`);

    addedDisplay.classList.add('added-to-cart-display');

    clearTimeout(timeOut[productId]);

      timeOut[productId] = setTimeout(()=>{
        addedDisplay.classList.remove('added-to-cart-display')
      },2000);
  }

  function updateCartQuantity(){
    const cartQuantity = cart.calculateCartQuantity();

    document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
  }

  document.querySelectorAll('.js-add-to-cart').forEach(button=>{
    button.addEventListener('click',()=>{

      const productId = button.getAttribute('data-product-id');

      cart.addToCart(productId);

      updateCartQuantity();

      displayAddedToCartText(productId);
    })
  })
}
function searchItem() {
    const searchButton = document.querySelector('.js-search-button');

    searchButton.addEventListener('click', (event) => {
        event.preventDefault();
        let inputValue = document.querySelector('.js-search-bar').value.trim();
        
        if (inputValue) {
            let newURL = `amazon.html?search=${encodeURIComponent(inputValue)}`;
            window.location.href = newURL; // Update URL and reload the page
        }
    });
}
searchItem()

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const savedValue =params.get("search");
    if (savedValue) {
        const searchInput = document.querySelector('.js-search-bar');
        if (searchInput) {
            searchInput.value = savedValue;
        }
        
        setTimeout(() => {
            displaySearch(savedValue);
        }, 600); // Simulate loading delay
    }
});

function displaySearch(savedValue) {
    let productsHTML = '';
    let hasMatch = false;
    
    products.forEach(product => {
        let matchesKeyword = product.keywords.some(keyword => keyword.toLowerCase() === savedValue.toLowerCase());
        let matchesName = product.name.toLowerCase().includes(savedValue.toLowerCase());
        
        if (matchesKeyword || matchesName) {
            hasMatch = true;
            productsHTML += `
                <div class="product-container">
                    <div class="product-image-container">
                        <img class="product-image" src="${product.image}">
                    </div>
                    <div class="product-name limit-text-to-2-lines">${product.name}</div>
                    <div class="product-rating-container">
                        <img class="product-rating-stars" src="${product.getStarsUrl()}">
                        <div class="product-rating-count link-primary">${product.rating.count}</div>
                    </div>
                    <div class="product-price">${product.getPrice()}</div>
                    <div class="product-quantity-container">
                        <select class="js-quantity-selector-${product.id}">
                            ${Array.from({ length: 10 }, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('')}
                        </select>
                    </div>
                    ${product.extraInfoHTML()}
                    <div class="product-spacer"></div>
                    <div class="added-to-cart js-added-${product.id}">
                        <img src="images/icons/checkmark.png"> Added
                    </div>
                    <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
                        Add to Cart
                    </button>
                </div>
            `;
        }
        document.querySelector('.js-products-grid').innerHTML = productsHTML
    });
    
    if (!hasMatch) {
        productsHTML = '<div class="no-matching-item">No products matched your search.</div>';
    }
    document.querySelector('.js-products-grid').innerHTML = productsHTML;
    //document.querySelector('.js-search-bar').value = '';
    
    let timeOut = {};


    function displayAddedToCartText(productId){
        const addedDisplay = document.querySelector(`.js-added-${productId}`);

        addedDisplay.classList.add('added-to-cart-display');

        clearTimeout(timeOut[productId]);

        timeOut[productId] = setTimeout(()=>{
            addedDisplay.classList.remove('added-to-cart-display')
        },2000);
    }

    function updateCartQuantity(){
        const cartQuantity = cart.calculateCartQuantity();

        document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
    }

    document.querySelectorAll('.js-add-to-cart').forEach(button=>{
        button.addEventListener('click',()=>{

        const productId = button.getAttribute('data-product-id');

        cart.addToCart(productId);

        updateCartQuantity();

        displayAddedToCartText(productId);
        })
    })
}

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