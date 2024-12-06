async function fetchMonthlyProductData(month) {
    try {
        const response = await fetch('monthlyProductSale.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ month }),
        });

        const products = await response.json();
        console.log('Fetched products:', products);

        const container = document.getElementById('product-item-container');
        container.innerHTML = ''; // Clear container before appending new items

        let totalSales = 0;

        products.forEach((product, index) => {
            const productItem = document.createElement('div');
            productItem.classList.add('product-item');

            productItem.innerHTML = `
                <img src="/POS/${product.image_path}" alt="${product.prod_name}">
                <div class="product-details">
                    <h2 class="item">${product.prod_name}</h2>
                    <p>Quantity Sold: <span>${product.total_sold}</span></p>
                    <p>Total Sales: <span>${product.total_price} PHP</span></p>
                </div>
            `;
            
            container.appendChild(productItem);
            totalSales += parseFloat(product.total_price);
        });

        document.getElementById('totalAmount').textContent = `Total Monthly Product Sales: ${totalSales.toFixed(2)} PHP`;
    } catch (error) {
        console.error('Error fetching monthly product data:', error);
    }
}

// Event listener for the dropdown selection change
document.getElementById('month-select').addEventListener('change', (event) => {
    const selectedMonth = event.target.value;
    fetchMonthlyProductData(selectedMonth);
});

// Automatically load data for the current month on page load
document.addEventListener('DOMContentLoaded', () => {
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
    document.getElementById('month-select').value = currentMonth;
    fetchMonthlyProductData(currentMonth);
});

