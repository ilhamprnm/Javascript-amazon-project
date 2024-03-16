import { cart, removeFromCart, updateQuantity, updateDeliveryOption } from "../../data/cart.js";
import { products, getProduct } from "../../data/products.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js" ;
import { deliveryOptions, getDeliveryOption, calculateDeliveryDate } from "../../data/deliveryoptions.js";
import { renderPaymentSummary } from "./paymentsummary.js"; 
import { renderCheckoutHeader } from "./checkoutHeader.js";

export function renderOrderSummary() {

  let cartSummaryHTML = "" ;

  cart.forEach((cartItem) => {
    const productId = cartItem.productId ;

    const matchingProduct = getProduct(productId);

    const deliveryOptionId = cartItem.deliveryOptionId;

    let deliveryOption = getDeliveryOption(deliveryOptionId);

    const deliveryFormat = calculateDeliveryDate(deliveryOption); 

    cartSummaryHTML += 
    `
      <div class="cart-item-container 
      js-cart-item-containers
      js-cart-item-containers-${matchingProduct.id}">
        <div class="delivery-date">
          Delivery date:  ${deliveryFormat}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image"
            src="${matchingProduct.image}">

          <div class="cart-item-details">
            <div class="product-name">
              ${matchingProduct.name}
            </div>
            <div class="product-price">
              $${(matchingProduct.priceCents / 100).toFixed(2)}
            </div>
            <div class="product-quantity js-product-quantity-${matchingProduct.id}">
              <span>
                Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
              </span>
              <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
                Update
              </span>
              <input class="quantity-input js-quantity-input-${matchingProduct.id}" data-product-id="${matchingProduct.id}">
              <span class="save-quantity-link link-primary js-save-link" data-product-id="${matchingProduct.id}">Save</span>
              <span class="delete-quantity-link link-primary js-delete-link js-delete-link-${matchingProduct.id}" data-product-id="${matchingProduct.id}">
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

    document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML ;

  });



  function deliveryOptionsHTML(matchingProduct, cartItem) {

    let html = '';

    deliveryOptions.forEach((deliveryOption) => {

      const deliveryFormat = calculateDeliveryDate(deliveryOption); 

      const priceString = deliveryOption.priceCents === 0 
      ? 'FREE '
      :  `$${(deliveryOption.priceCents / 100).toFixed(2)} -`;
      
      const isChecked = deliveryOption.id === cartItem.deliveryOptionId ;

      html += 
      `
        <div class="delivery-option js-delivery-option"
        data-product-id="${matchingProduct.id}" 
        data-delivery-option-id="${deliveryOption.id}">
          <input type="radio"
            ${isChecked ? 'checked' : '' }
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
              ${deliveryFormat}
            </div>
            <div class="delivery-option-price">
              ${priceString} Shipping
            </div>
          </div>
        </div>
      ` ;
    })

    return html;
  }

  document.querySelectorAll('.js-delete-link').forEach((deleteLink) => {
    deleteLink.addEventListener('click', () => {
      const productId = deleteLink.dataset.productId;
      removeFromCart(productId);
      
      renderOrderSummary();

      cartQuantity();

      renderPaymentSummary();

      renderCheckoutHeader();
    })
  })

  document.querySelectorAll('.js-update-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId ;

      const container = document.querySelector(`.js-cart-item-containers-${productId}`);
      
      container.classList.add('is-editing-quantity') ;

      link.classList.add('remove-update');

    })
  })

  document.querySelectorAll('.js-save-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId ;

      const inputValue = document.querySelector(`.js-quantity-input-${productId}`);

      const valueNumber = Number(inputValue.value);
      
      if (valueNumber < 0 || valueNumber > 1000) {
        return ;
      }

      updateQuantity(productId, valueNumber);

      const container = document.querySelector(`.js-cart-item-containers-${productId}`);

      container.classList.remove('is-editing-quantity') ;

      document.querySelectorAll('.js-update-link').forEach((link) => {
        link.classList.remove('remove-update')
      });

      renderOrderSummary();

      renderCheckoutHeader();

      renderPaymentSummary();

      cartQuantity();
    })
  })

  function cartQuantity() {

    let cartQuantity = 0 ;

    cart.forEach((cartItem) => {
        cartQuantity += cartItem.quantity ;
    })
    
  }

  cartQuantity();

  document.querySelectorAll('.js-delivery-option')
    .forEach((element) => {
      const productId = element.dataset.productId;
      const deliveryOptionId = element.dataset.deliveryOptionId;
      // const {productId, deliveryOptionId} = element.dataset; (shorthand property)

      element.addEventListener('click', () => {
        updateDeliveryOption(productId, deliveryOptionId);
        renderOrderSummary();
        renderPaymentSummary();  
      })
    })
}


  