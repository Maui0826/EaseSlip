async function fetchProductData() {
    try {
      // Fetch data from the PHP script
      const response = await fetch('daily-product-php.php');
      const products = await response.json();
      console.log(products);
  
      const container = document.getElementById('product-item-container');
      container.innerHTML = ''; // Clear container before appending data
  
      let totalSales = 0;
  
      products.forEach((product, index) => {
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');
  
        productItem.innerHTML = `
          <img src="/assets/LOGO.png" alt="LOGO">
          <div class="product-details">
            <h2 class="item" id="item-${index}">${product.prod_name}</h2>
            <p>Quantity Sold: <span id="quantity-${index}">${product.total_sold}</span></p>
            <p>Total Sales: <span id="total-${index}">${product.total_price} PHP</span></p>
          </div>
        `;
  
        container.appendChild(productItem);
  
        totalSales += parseFloat(product.total_price);
      });
  
      // Update total sales
      document.getElementById('totalAmount').textContent = `Total Daily Product Sales: ${totalSales} PHP`;
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
  }
  
  // Fetch and display product data on page load
  fetchProductData();
  