// Function to repeat the product-item div a specified number of times
function repeatProductItems(num) {
    const container = document.getElementById('product-item-container'); // Get the container element

    // Loop to create and insert the desired number of product items
    for (let i = 0; i < num; i++) {
        // Create a new product-item div
        const productItem = document.createElement('div');
        productItem.classList.add('product-item'); // Add class for styling

        // Add HTML content to the new product-item div
        productItem.innerHTML = `
            <img src="/assets/LOGO.png" alt="LOGO">
            <div class="product-details">
                <h2 class="item" id="item-${i}">Item ${i + 1}</h2>
                <p>Quantity: <span id="quantity-${i}">30</span></p>
                <p>Total: <span id="total-${i}">2030PHP</span></p>
            </div>
        `;

        // Append the new product-item div to the container
        container.appendChild(productItem);
    }
}

// Example: Repeat the product item 5 times
repeatProductItems(8);