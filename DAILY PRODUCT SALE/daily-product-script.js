async function fetchProductData(date) {
    try {
      // Send the selected date to the PHP script
      const response = await fetch('daily-product-php.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date }),
      });
  
      const products = await response.json();
      console.log(products);
  
      const container = document.getElementById('product-item-container');
      container.innerHTML = ''; // Clear container before appending data
  
      let totalSales = 0;
  
      products.forEach((product, index) => {
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');
  
        productItem.innerHTML = `
          <img src="/POS/${product.image_path}" alt="${product.prod_name}">
          <div class="product-details">
            <h2 class="item" id="item-${index}">${product.prod_name}</h2>
            <p>Quantity Sold: <span id="quantity-${index}">${product.total_sold}</span></p>
            <p>Total Sales: <span id="total-${index}">${product.total_price} PHP</span></p>
          </div>
        `;
        console.log(product.image_path);
  
        container.appendChild(productItem);
  
        totalSales += parseFloat(product.total_price);
      });
  
      // Update total sales
      document.getElementById('totalAmount').textContent = `Total Daily Product Sales: ${totalSales.toFixed(2)} PHP`;
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
  }
  
  // Event listener for date input
  document.getElementById('date-select').addEventListener('change', (event) => {
    const selectedDate = event.target.value;
    fetchProductData(selectedDate);
  });
  
  // Fetch data for the current date on page load
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('date-select').value = today;
  fetchProductData(today);
  
  
  