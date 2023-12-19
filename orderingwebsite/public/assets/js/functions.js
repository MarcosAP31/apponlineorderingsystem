document.addEventListener('DOMContentLoaded', function () {
  // Get all delete buttons
  var deleteButtons = document.querySelectorAll('.delete-btn');

  // Add click event listener to each delete button
  deleteButtons.forEach(function (button) {
    button.addEventListener('click', function (event) {
      // Prevent the default behavior of the link
      event.preventDefault();

      // Find the closest cat-product-box ancestor
      var catProductBox = button.closest('.cat-product-box');

      // Remove the cat-product-box element
      if (catProductBox) {
        catProductBox.remove();

        // Call a function to update the total price
        updateTotalPrice();
      }
    });
  });

  // Function to update the total price
  function updateTotalPrice() {
    var totalElements = document.querySelectorAll('.cat-product-box .price-cart a');
    var totalPrice = 0;
    totalElements.forEach(function (element) {
      var price = parseFloat(element.innerText.replace('$', '').trim());
      totalPrice += price;
    });

    // Update the total price element
    var totalElement = document.querySelector('.item-total .total-price span:last-child');
    if (totalElement) {
      totalElement.innerText = '$' + totalPrice.toFixed(2);
    }
  }

  // Fetch products from your APIcategoriesContainer
  fetch('http://192.168.1.197:3000/apiorderingsystem/menucategory')
    .then(response => response.json())
    .then(categories => {
      const itemsContainer = document.getElementById('itemsContainer');

      // Loop through the categories
      categories.forEach(category => {
        // Create a container for each category
        const categoryContainer = document.createElement('div');
        categoryContainer.className = 'category-container';

        // Create and append category card to the category container
        const categoryCard = createCategoryCard(category);
        categoryContainer.appendChild(categoryCard);

        // Fetch products for each category
        fetch(`http://192.168.1.197:3000/apiorderingsystem/menuitem/categoryid/${category.CategoryId}`)
          .then(response => response.json())
          .then(products => {
            // Create a container for products of the current category
            const productsContainer = document.createElement('div');
            productsContainer.className = 'products-container';

            // Loop through the products and create product cards
            products.forEach(product => {
              const productCard = createProductCard(product);
              productsContainer.appendChild(productCard);
            });

            // Append the products container to the category container
            categoryContainer.appendChild(productsContainer);

            // Append the category container to the main container
            itemsContainer.appendChild(categoryContainer);
          })
          .catch(error => {
            console.error(`Error fetching products for category ${category}:`, error);
          });
      });
    })
    .catch(error => {
      console.error('Error fetching products:', error);
    });

  function createCategoryCard(category) {
    // Create product card element
    const categoryCard = document.createElement('div');
    categoryCard.className = 'restaurent-category-list';

    // Create unique class names and IDs for each category and product
    const categoryClass = `category_${category.CategoryId}`;
    const collapseId = `collapse_${category.CategoryId}`;

    // Populate product card with data from the API
    categoryCard.innerHTML = `
    <div class="section-header-left">
        <h3 class="text-light-black header-title">
            <a class="card-link text-light-black no-margin" data-toggle="collapse" href="#${collapseId}">
${category.Name}
          </a>
        </h3>
    </div>`;

    // Add event listener to the category name link to toggle visibility
    const categoryLink = categoryCard.querySelector(`.${categoryClass}`);
    if (categoryLink) {
      categoryLink.addEventListener('click', () => toggleVisibility(collapseId));
    }
    return categoryCard;
  }

  function createProductCard(product) {
    // Create product card element
    const productCard = document.createElement('div');
    productCard.className = 'restaurent-product-list';

    // Create unique class names and IDs for each category and product
    const categoryClass = `category_${product.CategoryId}`;
    const productClass = `product_${product.ItemId}`;
    const collapseId = `collapse_${product.CategoryId}`;

    // Populate product card with data from the API
    productCard.innerHTML = `
    
                                
                                <div id="${collapseId}" class="collapse show ${categoryClass}">
                                    <div class="card-body no-padding">
                                        <div class="row">
                                        <div class="col-lg-12 ${productClass}" id="productsContainer">
                                            <div class="restaurent-product-detail">
            <div class="restaurent-product-left">
              <div class="restaurent-product-title-box">
                <div class="restaurent-product-box">
                  <div class="restaurent-product-title">
                    <h6 class="mb-2" data-toggle="modal" data-target="#restaurent-popup">
                      <a href="javascript:void(0)" class="text-light-black fw-600">${product.Name}</a>
                    </h6>
                    <p class="text-light-white">600-700 Cal.</p>
                  </div>
                  <div class="restaurent-product-label">
                    <span class="rectangle-tag bg-gradient-red text-custom-white">Label</span>
                    <span class="rectangle-tag bg-dark text-custom-white">Combo</span>
                  </div>
                </div>
                <div class="restaurent-product-rating">
                    <div class="ratings"> <span class="text-yellow"><i class="fas fa-star"></i></span>
                        <span class="text-yellow"><i class="fas fa-star"></i></span>
                        <span class="text-yellow"><i class="fas fa-star"></i></span>
                        <span class="text-yellow"><i class="fas fa-star"></i></span>
                        <span class="text-yellow"><i class="fas fa-star-half-alt"></i></span>
                    </div>
                    <div class="rating-text">
                        <p class="text-light-white fs-12 title">3845 ratings</p>
                    </div>
                </div>
              </div>
              <div class="restaurent-product-caption-box">
                <span class="text-light-white">${product.Description}</span>
              </div>
              <div class="restaurent-tags-price">
                    <div class="restaurent-tags"> 
                        <span class="text-custom-white square-tag">
                            <img src="assets/img/svg/004-leaf.svg" alt="tag">
                        </span>
                        <span class="text-custom-white square-tag">
                            <img src="assets/img/svg/006-chili.svg" alt="tag">
                          </span>
                        <span class="text-custom-white square-tag">
                            <img src="assets/img/svg/005-chef.svg" alt="tag">
                          </span>
                        <span class="text-custom-white square-tag">
                            <img src="assets/img/svg/008-protein.svg" alt="tag">
                          </span>
                        <span class="text-custom-white square-tag">
                            <img src="assets/img/svg/009-lemon.svg" alt="tag">
                          </span>
                    </div> 
                        <span class="circle-tag">
                            <img src="assets/img/svg/010-heart.svg" alt="tag">
                        </span>
                    <div class="restaurent-product-price">
                        <h6 class="text-success fw-600 no-margin">S/.${product.Price}</h6>
                    </div>
                </div>
            </div>
            <div class="restaurent-product-img">
            <img src="http://192.168.1.197:3000/build/uploads/img/${product.Image}" class="img-fluid" alt="#">
            </div>
            <button class="add-to-cart-btn" onclick="addToCart(${product.ItemId}, '${product.Name}', ${product.Price})">
                Add to Cart
            </button>
          </div>
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>
          
        `;


    return productCard;
  }


});
// Function to toggle visibility of products
function toggleVisibility(collapseId) {
  const allCollapseElements = document.querySelectorAll('.collapse');

  allCollapseElements.forEach(collapseElement => {
    // Toggle the visibility of the collapse element
    const isVisible = collapseElement.classList.contains('show');
    if (collapseElement.id === collapseId) {
      // Show or hide only the selected collapse element
      collapseElement.classList.toggle('show', !isVisible);
    } else {
      // Hide other collapse elements
      collapseElement.classList.remove('show');
    }
  });
}


// Function to handle quantity changes
function handleQuantityChange(productId, action) {
  const quantityElement = document.querySelector(`.cat-product-box[data-product-id="${productId}"] .cat-name span`);
  let quantity = parseInt(quantityElement.textContent);

  if (action === 'increase') {
    quantity++;
  } else if (action === 'decrease' && quantity > 1) {
    quantity--;
  }

  quantityElement.textContent = quantity;
  updateTotalPrice(productId, quantity);
}

// Example: Add event listeners for quantity change buttons
document.addEventListener('click', function (event) {
  if (event.target.classList.contains('quantity-increase')) {
    const productId = event.target.closest('.cat-product-box').getAttribute('data-product-id');
    handleQuantityChange(productId, 'increase');
  } else if (event.target.classList.contains('quantity-decrease')) {
    const productId = event.target.closest('.cat-product-box').getAttribute('data-product-id');
    handleQuantityChange(productId, 'decrease');
  }
});

function addToCart(ItemId, Name, Price) {
  // Assume you have a function to handle adding products to the shopping cart
  // You can replace this with your actual logic to add the product to the cart
  addProductToCart(ItemId, Name, Price);
}

function addProductToCart(ItemId, Name, Price) {
  // Add the product to the shopping cart logic
  // You can use localStorage, session storage, or make an API call to add the product to the cart
  // For simplicity, let's use localStorage in this example

  const cartItem = {
    ItemId: ItemId,
    name: Name,
    price: Price,
    quantity: 1 // You can modify this if you want to track quantities
  };

  // Check if the shopping cart already exists in localStorage
  let shoppingCart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

  // Check if the product is already in the cart
  const existingCartItemIndex = shoppingCart.findIndex(item => item.ItemId === ItemId);

  if (existingCartItemIndex !== -1) {
    // If the product is already in the cart, update the quantity
    shoppingCart[existingCartItemIndex].quantity += 1;
  } else {
    // If the product is not in the cart, add it
    shoppingCart.push(cartItem);
  }

  // Update the shopping cart in localStorage
  localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));

  // Optionally, update the UI to reflect the added item in the shopping cart
  updateShoppingCartUI();
}

function updateShoppingCartUI() {
  // Update the UI to reflect the current state of the shopping cart
  const shoppingCartContainer = document.querySelector('.cart-detail-box .card-body');
  const shoppingCartTotal = document.querySelector('.cart-detail-box .item-total .total-price span:last-child');

  // Get the shopping cart from localStorage
  const shoppingCart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

  // Clear the current content in the shopping cart container
  shoppingCartContainer.innerHTML = '';

  // Iterate over each item in the shopping cart and update the UI
  shoppingCart.forEach(item => {
    const cartItemBox = document.createElement('div');
    cartItemBox.className = 'cat-product-box';
    cartItemBox.dataset.ItemId = item.ItemId;

    const cartItem = document.createElement('div');
    cartItem.className = 'cat-product';

    const cartName = document.createElement('div');
    cartName.className = 'cat-name';
    cartName.innerHTML = `
      <p class="text-light-green">
        <span class="text-dark-white">${item.quantity}</span>
        ${item.name}
      </p>
      <span class="text-light-white">${item.description}</span>
    `;

    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.value = item.quantity;
    quantityInput.min = '1';

    // Apply CSS styles to decrease the size of the input
    quantityInput.style.width = '50px'; // Adjust the width as needed
    quantityInput.style.height = '20px'; // Adjust the height as needed

    quantityInput.addEventListener('change', () => updateCartItemQuantity(item.ItemId, parseInt(quantityInput.value)));

    const deleteBtn = document.createElement('div');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = `<a href="#" class="text-dark-white" onclick="removeCartItem(${item.ItemId})"> <i class="far fa-trash-alt"></i></a>`;

    const priceCart = document.createElement('div');
    priceCart.className = 'price-cart';
    priceCart.innerHTML = `<a href="#" class="text-dark-white fw-500">$${(item.price * item.quantity).toFixed(2)}</a>`;

    cartItem.appendChild(cartName);
    cartItem.appendChild(quantityInput);
    cartItem.appendChild(deleteBtn);
    cartItem.appendChild(priceCart);

    cartItemBox.appendChild(cartItem);

    shoppingCartContainer.appendChild(cartItemBox);
  });

  // Calculate and display the total price
  const totalPrice = shoppingCart.reduce((total, item) => total + item.price * item.quantity, 0);
  shoppingCartTotal.textContent = `$${totalPrice.toFixed(2)}`;

  // Add the HTML structure for the total price of the order
  const cartItemTotalContainer = document.createElement('div');
  cartItemTotalContainer.className = 'item-total';
  cartItemTotalContainer.innerHTML = `
    <div class="total-price border-0">
      <span class="text-dark-white fw-700">Items subtotal:</span>
      <span class="text-dark-white fw-700">$${totalPrice.toFixed(2)}</span>
    </div>
    <div class="empty-bag padding-15">
      <a href="#">Empty bag</a>
    </div>
    
  `;
  shoppingCartContainer.appendChild(cartItemTotalContainer);
}

function checkout() {
  // Get the shopping cart from localStorage
  const shoppingCart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

  // Gather information for the new order
  const UserId = 2; // Replace with the actual user ID
  const OrderDate = new Date().toString();
  const TotalAmount = calculateTotalPrice(shoppingCart);

  // Create the order object
  const newOrder = {
    UserId: UserId,
    OrderDate: OrderDate,
    TotalAmount: TotalAmount,
    Status: 'In progress', // Set the initial status
    PaymentStatus: 'Pending' // Set the initial payment status
  };

  // Create order items
  const orderItems = shoppingCart.map(item => ({
    ItemId: item.ItemId, // Replace with the actual item ID from your data
    Quantity: item.quantity,
    Subtotal: item.price * item.quantity
  }));

  // Combine order information and order items
  const requestBody = { order: newOrder, orderItems };

  // Make a POST request to your API endpoint for creating orders and order items
  fetch('http://192.168.1.197:3000/apiorderingsystem/order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Add any additional headers if needed
    },
    body: JSON.stringify(requestBody)
  })
    .then(response => response.json())
    .then(responseData => {
      // Optionally, you can handle the response from the server
      console.log('Order and order items created:', responseData);

      // Clear the shopping cart after the order is successfully created
      localStorage.removeItem('shoppingCart');

      // Update the UI to reflect the empty shopping cart
      updateShoppingCartUI();
    })
    .catch(error => {
      console.error('Error creating order and order items:', error);
      // Handle the error as needed
    });
}

function calculateTotalPrice(shoppingCart) {
  return shoppingCart.reduce((total, item) => total + item.price * item.quantity, 0);
}

function updateCartItemQuantity(itemId, newQuantity) {
  // Update the quantity of the item in the shopping cart
  const shoppingCart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
  const updatedCart = shoppingCart.map(item => {
    if (item.ItemId === itemId) {
      return { ...item, quantity: newQuantity };
    }
    return item;
  });
  localStorage.setItem('shoppingCart', JSON.stringify(updatedCart));

  // Update the UI to reflect the new quantity
  updateShoppingCartUI();
}

function removeCartItem(ItemId) {
  // Remove the item from the shopping cart based on the product ID
  // You can replace this with your actual logic to remove items from the cart
  // For simplicity, let's use localStorage in this example

  let shoppingCart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

  // Find the index of the item to be removed
  const indexToRemove = shoppingCart.findIndex(item => item.ItemId === ItemId);

  if (indexToRemove !== -1) {
    // Remove the item from the shopping cart array
    shoppingCart.splice(indexToRemove, 1);

    // Update the shopping cart in localStorage
    localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));

    // Update the UI to reflect the removal
    updateShoppingCartUI();
  }
}