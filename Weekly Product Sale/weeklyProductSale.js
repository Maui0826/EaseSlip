// Function to create and insert product items
function createProductItems(num) {
    const container = document.getElementById('product-item'); // Get the container
    container.innerHTML = ''; // Clear any existing content

    // Loop to create the desired number of product items
    for (let i = 0; i < num; i++) {
        const productItem = document.createElement('div');
        productItem.classList.add('product-item'); // Add class for styling

        // Add HTML content for each product item
        productItem.innerHTML = `
            <img src="/assets/LOGO.png" alt="LOGO">
            <div class="product-details">
                <h2 class="item" id="item-${i}">Item ${i + 1}</h2>
                <p>Quantity: <span id="quantity-${i}">30</span></p>
                <p>Total: <span id="total-${i}">2030PHP</span></p>
            </div>
        `;

        // Append the new product item to the container
        container.appendChild(productItem);
    }
}

// Example: Create 5 product items
createProductItems(5);
