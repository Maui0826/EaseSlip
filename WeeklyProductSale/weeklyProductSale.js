async function fetchWeeklyProductData(month, week, year) {
    try {
        const response = await fetch('weeklyProductSale.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ month, week, year }), // Send year along with month and week
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
                <img src="/INVENTORY/${product.image_path}" alt="${product.prod_name}">
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

// Set current month, week, and year on page load
function setDefaultDateValues() {
    const today = new Date();

    // Set current month in the select dropdown
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const currentMonth = today.getMonth(); // 0-indexed
    document.getElementById('month-select').value = months[currentMonth];

    // Set current week (assuming the week is based on the first day of the month)
    const currentWeek = Math.ceil(today.getDate() / 7); // This calculates the week of the month (1-4)
    document.getElementById('week-range').value = `Week ${currentWeek}`;

    // Set current year in the year select dropdown
    const yearSelect = document.getElementById('year-select');
    const currentYear = today.getFullYear();
    
    // Clear existing options first
    yearSelect.innerHTML = '';

    // Populate year dropdown with the current year and the previous 4 years
    for (let i = currentYear; i >= currentYear - 4; i--) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        yearSelect.appendChild(option);
    }

    // Set the current year as the selected option
    yearSelect.value = currentYear;
}

// Event listeners for dropdowns (including year selector)
document.getElementById('month-select').addEventListener('change', updateData);
document.getElementById('week-range').addEventListener('change', updateData);
document.getElementById('year-select').addEventListener('change', updateData); // Add event listener for year select

function updateData() {
    const selectedMonth = document.getElementById('month-select').value;
    const selectedWeek = parseInt(document.getElementById('week-range').value.replace('Week ', ''));
    const selectedYear = document.getElementById('year-select').value; // Get selected year

    fetchWeeklyProductData(selectedMonth, selectedWeek, selectedYear); // Pass selected year
}

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    setDefaultDateValues(); // Set the default values when the page loads
    updateData(); // Load the initial data
});
