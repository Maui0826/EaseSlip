let monthlyProductChart;

async function fetchMonthlyProductData(month, year) {
    try {
        console.log(`Fetching data for Month: ${month}, Year: ${year}`); // Debugging

        const response = await fetch('monthlyProductSale.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ month, year }),
        });

        const products = await response.json();

        const container = document.getElementById('product-item-container');

        // Clear the container before appending new items
        container.innerHTML = '';

        if (!products || products.length === 0) {
            // No sales data for the selected month and year
            container.innerHTML = `<p>No sales data available for ${month} ${year}.</p>`;
            document.getElementById('totalAmount').textContent = `Total Monthly Product Sales: ₱0.00 PHP`;
            return;  // Exit the function if there's no data
        }

        let totalSales = 0;

        products.forEach((product) => {
            const productItem = document.createElement('div');
            productItem.classList.add('product-item');

            productItem.innerHTML = `
                <img src="/INVENTORY/${product.image_path}" alt="${product.prod_name}" onerror="this.src='/default-image.jpg';">
                <div class="product-details">
                    <h2>${product.prod_name}</h2>
                    <p>Quantity Sold: <span>${product.total_sold}</span></p>
                    <p>Total Sales: <span>₱${parseFloat(product.total_price).toFixed(2)} PHP</span></p>
                </div>
            `;

            container.appendChild(productItem);
            totalSales += parseFloat(product.total_price);
        });

        document.getElementById('totalAmount').textContent = `Total Monthly Product Sales: ₱${totalSales.toFixed(2)} PHP`;
    } catch (error) {
        console.error('Error fetching monthly product data:', error);

        const container = document.getElementById('product-item-container');
        container.innerHTML = `<p>An error occurred while fetching sales data. Please try again later.</p>`;
        document.getElementById('totalAmount').textContent = `Total Monthly Product Sales: ₱0.00 PHP`;
    }
}

// Event listener for month selection change
document.getElementById('month-select').addEventListener('change', () => {
    const selectedMonth = document.getElementById('month-select').value;
    const selectedYear = document.getElementById('year-select').value;
    fetchMonthlyProductData(selectedMonth, selectedYear);
});

// Event listener for year selection change
document.getElementById('year-select').addEventListener('change', () => {
    const selectedMonth = document.getElementById('month-select').value;
    const selectedYear = document.getElementById('year-select').value;
    fetchMonthlyProductData(selectedMonth, selectedYear);
});

// Populate the year dropdown with the last 5 years
function populateYearDropdown() {
    const yearSelect = document.getElementById('year-select');
    const currentYear = new Date().getFullYear();

    yearSelect.innerHTML = '';
    for (let i = currentYear; i >= currentYear - 4; i--) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        yearSelect.appendChild(option);
    }
    yearSelect.value = currentYear;
}

// Automatically fetch data for the current month and year on page load
document.addEventListener('DOMContentLoaded', () => {
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
    const currentYear = currentDate.getFullYear();

    document.getElementById('month-select').value = currentMonth;
    document.getElementById('year-select').value = currentYear;

    populateYearDropdown();
    fetchMonthlyProductData(currentMonth, currentYear);
});
