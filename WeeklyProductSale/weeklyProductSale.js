document.addEventListener("DOMContentLoaded", function () {
    const productsContainer = document.getElementById("product-item-container"); // Container for displaying products
    const monthSelect = document.getElementById("month-select");
    const weekSelect = document.getElementById("week-range");
    const yearSelect = document.getElementById("year-select");
    const totalWeeklySaleElement = document.getElementById("totalAmount");
    const weekRangeDisplay = document.getElementById("week-range-display"); // Display for the selected week range

    monthSelect.addEventListener("change", fetchAndRenderData);
    weekSelect.addEventListener("change", fetchAndRenderData);
    yearSelect.addEventListener("change", fetchAndRenderData);

    const currentYear = new Date().getFullYear();

    // Populate the year dropdown (e.g., from 2020 to the current year)
    for (let i = 2020; i <= currentYear; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        yearSelect.appendChild(option);
    }

    // Set default date (current month, week, and year)
    function setDefaultDate() {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth(); // 0 = January, 11 = December
        const currentWeek = Math.ceil(currentDate.getDate() / 7); // Calculate the current week (1-4)

        monthSelect.selectedIndex = currentMonth;
        weekSelect.selectedIndex = currentWeek - 1;
        yearSelect.value = currentYear;
    }

    setDefaultDate(); // Set default values on page load
    fetchAndRenderData(); // Fetch initial data based on default values

    // Helper function to calculate the start and end dates of the selected week
    function getWeekStartEndDates(year, month, weekNumber) {
        const firstDayOfMonth = new Date(year, month, 1);
        const firstDayOfWeek = firstDayOfMonth.getDay(); // Day of the week (0 = Sunday, 6 = Saturday)
    
        // Calculate the starting date of the selected week
        const startDate = new Date(year, month, 1 + (weekNumber - 1) * 7 - firstDayOfWeek);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
    
        // Ensure startDate doesn't go before the first day of the month
        if (startDate < firstDayOfMonth) {
            startDate.setDate(1); // Set to the first day of the month
        }
    
        // Ensure endDate doesn't go beyond the last day of the month
        const lastDayOfMonth = new Date(year, month + 1, 0); // Last day of the month
        if (endDate > lastDayOfMonth) {
            endDate.setDate(lastDayOfMonth.getDate());
        }
    
        return { startDate, endDate };
    }
    

    async function fetchAndRenderData() {
        const selectedMonth = monthSelect.value;
        const selectedWeek = parseInt(weekSelect.value.replace('Week ', ''), 10); // Get week number
        const selectedYear = yearSelect.value;
    
        try {
            const response = await fetch(`weeklyProductSale.php?month=${selectedMonth}&week=${selectedWeek}&year=${selectedYear}`);
            const data = await response.json();
            console.log(data); // Debugging: log the raw data
    
            // Clear any existing content in the products container
            productsContainer.innerHTML = '';
    
            // If no data, alert the user and update UI accordingly
            if (!data || Object.keys(data).length === 0) {
                alert("No sales data available for this week.");
                totalWeeklySaleElement.innerText = `Total Weekly Product Sales: ₱0.00 PHP`;
                weekRangeDisplay.innerText = `Selected Week: No data available`;
                return; // Exit the function
            }
    
            let totalWeeklySale = 0;
    
            // Calculate the start and end dates of the selected week
            const monthNumber = new Date(Date.parse(`${selectedMonth} 1`)).getMonth();
            const { startDate, endDate } = getWeekStartEndDates(selectedYear, monthNumber, selectedWeek);
    
            const startDateFormatted = startDate.toISOString().split('T')[0];
            const endDateFormatted = endDate.toISOString().split('T')[0];
    
            // Display the selected week range
            weekRangeDisplay.innerText = `Selected Week: ${startDateFormatted} to ${endDateFormatted}`;
    
            // Iterate through the product data
            Object.keys(data).forEach((productName) => {
                const product = data[productName];
                const sales = product.sales; // Access the sales object
    
                let totalSold = 0;
                let totalPrice = 0;
    
                // Calculate the total quantity sold and total sales for the product within the selected week
                for (let day = startDate.getDate(); day <= endDate.getDate(); day++) {
                    if (sales[day]) {
                        totalSold += sales[day].total_sold;
                        totalPrice += sales[day].total_amount;
                    }
                }
    
                // Skip rendering if no sales for this product in the week
                if (totalSold === 0 && totalPrice === 0) return;
    
                // Create the product item HTML
                const productItem = document.createElement('div');
                productItem.classList.add('product-item');
    
                productItem.innerHTML = `
                    <img src="/INVENTORY/${product.image_path}" alt="${productName}" onerror="this.src='/default-image.jpg';">
                    <div class="product-details">
                        <h2>${productName}</h2>
                        <p>Quantity Sold: ${totalSold}</p>
                        <p>Total Sales: ₱${totalPrice.toFixed(2)}</p>
                    </div>
                `;
    
                // Append the product item to the container
                productsContainer.appendChild(productItem);
    
                // Update the total weekly sales
                totalWeeklySale += totalPrice;
            });
    
            // Display the total weekly sale
            totalWeeklySaleElement.innerText = `Total Weekly Product Sales: ₱${totalWeeklySale.toFixed(2)} PHP`;
        } catch (error) {
            console.error("Error fetching or processing data:", error);
            alert("An error occurred while fetching sales data. Please try again later.");
            productsContainer.innerHTML = ''; // Clear the container on error
            totalWeeklySaleElement.innerText = `Total Weekly Product Sales: ₱0.00 PHP`;
            weekRangeDisplay.innerText = `Selected Week: No data available`;
        }
    }
});