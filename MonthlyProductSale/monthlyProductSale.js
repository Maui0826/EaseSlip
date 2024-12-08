async function fetchMonthlyProductData(month, year) {
    try {
        const response = await fetch('monthlyProductSale.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ month, year }), // Send both month and year to the server
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
                <img src="/INVENTORY/${product.image_path}" alt="${product.prod_name}">
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

// Populate the year dropdown with the last 5 years, including the current year
function populateYearDropdown() {
    const yearSelect = document.getElementById('year-select');
    const currentYear = new Date().getFullYear();
    
    // Clear the existing year options
    yearSelect.innerHTML = '';
    
    // Populate the year dropdown with the current year and the previous 4 years
    for (let i = currentYear; i >= currentYear - 4; i--) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        yearSelect.appendChild(option);
    }

    // Set the current year as the default selected value
    yearSelect.value = currentYear;
}

// Event listener for the dropdown selection change (both month and year)
document.getElementById('month-select').addEventListener('change', () => {
    const selectedMonth = document.getElementById('month-select').value;
    const selectedYear = document.getElementById('year-select').value;
    fetchMonthlyProductData(selectedMonth, selectedYear);
});

document.getElementById('year-select').addEventListener('change', () => {
    const selectedMonth = document.getElementById('month-select').value;
    const selectedYear = document.getElementById('year-select').value;
    fetchMonthlyProductData(selectedMonth, selectedYear);
});

// Automatically load data for the current month and year on page load
document.addEventListener('DOMContentLoaded', () => {
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
    const currentYear = currentDate.getFullYear();

    document.getElementById('month-select').value = currentMonth;
    document.getElementById('year-select').value = currentYear;

    populateYearDropdown(); // Populate the year dropdown
    fetchMonthlyProductData(currentMonth, currentYear); // Fetch data for current month and year
});
