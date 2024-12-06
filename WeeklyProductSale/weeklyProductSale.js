document.addEventListener("DOMContentLoaded", function () {
    const monthSelect = document.getElementById("month-select");
    const totalWeeklySaleElement = document.getElementById("totalWeeklySale");

    async function fetchWeeklyProductData(month, week) {
        try {
            const response = await fetch('weeklyProductSale.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ month, week }),
            });

            const products = await response.json();
            return products;
        } catch (error) {
            console.error('Failed to fetch weekly product data:', error);
            return [];
        }
    }

    async function updateData() {
        const currentDate = new Date();

        const month = currentDate.toLocaleString('default', { month: 'long' });
        const year = currentDate.getFullYear();

        // Determine the current week of the month
        const dayOfMonth = currentDate.getDate();
        const weekNumber = Math.ceil(dayOfMonth / 7); 

        console.log(`Current Month: ${month}`);
        console.log(`Current Year: ${year}`);
        console.log(`Current Week: ${weekNumber}`);

        const products = await fetchWeeklyProductData(month, weekNumber);

        const container = document.getElementById('product-item-container');
        container.innerHTML = '';  // Clear any existing content

        let totalSales = 0;

        products.forEach((product) => {
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

        totalWeeklySaleElement.innerText = `Total Weekly Product Sales: ₱${totalSales.toFixed(2)}`;
    }

    // Automatically update data on page load
    updateData();
});


async function fetchWeeklyProductData(month, week) {
    try {
        const response = await fetch('weeklyProductSale.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ month, week }),
        });

        const products = await response.json();
        console.log('Fetched products:', products);

        const container = document.getElementById('product-item-container');
        container.innerHTML = '';  // Clear any existing content

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

        document.getElementById('totalAmount').textContent = `Total Weekly Product Sales: ${totalSales.toFixed(2)} PHP`;

    } catch (error) {
        console.error('Failed to fetch weekly product data:', error);
    }
}

// Event listener for dropdown changes
document.getElementById('month-select').addEventListener('change', updateData);
document.getElementById('week-range').addEventListener('change', updateData);

function updateData() {
    const selectedMonth = document.getElementById('month-select').value;
    const selectedWeek = document.getElementById('week-range').value;

    fetchWeeklyProductData(selectedMonth, selectedWeek);
}

// Load product data when page loads
document.addEventListener('DOMContentLoaded', updateData);


