import {cart} from '../../data/cart.js';

export function renderCheckoutHeader() {

  let cartQuantity = 0;
  
  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity
  });
  
  const checkoutHeaderHTML = 
  `
    Checkout (<a class="return-to-home-link js-checkout-quantity"
      href="amazon.html"> ${cartQuantity} items</a>)
  `;

  document.querySelector('.js-checkout-header-middle-section')
    .innerHTML = checkoutHeaderHTML;
}