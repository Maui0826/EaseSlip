async function fetchWeeklyProductData(month, week) {
    try {
        const response = await fetch('weeklyProductSale.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ month, week }),
        });

        const products = await response.json();
        console.log('Fetched products:', products); // Check the raw response

        const container = document.getElementById('product-item-container');
        container.innerHTML = ''; // Clear previous content

        let totalSales = 0;

        // Iterate through the product data and display it
        products.forEach((product) => {
            const productItem = document.createElement('div');
            productItem.classList.add('product-item');

            productItem.innerHTML = `
                <img src="/POS/${product.image_path}" alt="${product.prod_name}">
                <div class="product-details">
                    <h2>${product.prod_name}</h2>
                    <p>Quantity Sold: ${product.total_sold}</p>
                    <p>Total Sales: ₱${product.total_price.toFixed(2)}</p>
                </div>
            `;

            container.appendChild(productItem);
            totalSales += parseFloat(product.total_price);
        });

        // Display the total sales for the week
        document.getElementById('totalAmount').textContent =
            `Total Weekly Product Sales: ₱${totalSales.toFixed(2)}`;
    } catch (error) {
        console.error('Failed to fetch weekly product data:', error);
    }
}

// Event listeners for dropdowns
document.getElementById('month-select').addEventListener('change', updateData);
document.getElementById('week-range').addEventListener('change', updateData);

function updateData() {
    const selectedMonth = document.getElementById('month-select').value;
    const selectedWeek = parseInt(document.getElementById('week-range').value);

    fetchWeeklyProductData(selectedMonth, selectedWeek);
}

// Initial load
document.addEventListener('DOMContentLoaded', updateData);