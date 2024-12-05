document.addEventListener("DOMContentLoaded", function () {
    const ctx = document.getElementById('salesChart').getContext('2d');
    const monthSelect = document.getElementById("month-select");
    const totalSaleElement = document.getElementById("totalmonthlySale");

    let salesChart; // Variable to store the chart instance

    // Function to fetch and render data
    async function fetchAndRenderData() {
        const selectedMonth = monthSelect.value;
        const response = await fetch(`monthlySale.php?month=${selectedMonth}`);
        
        const salesData = await response.json();
        console.log(salesData); // Check the fetched data
        
        if (Object.keys(salesData).length === 0) {
            alert("No sales data available for this month.");
            return;
        }
    
        // Ensure chart labels (days) and dataset values align
        const labels = Array.from({ length: 31 }, (_, i) => `${i + 1}`);  // Days 1-31
        const dailyTotalAmounts = Array(31).fill(0); // Initialize an array to store total sales amount for each day
        let totalSalesAmount = 0;

        // Calculate the total sales amount for each day
        for (const productName in salesData) {
            const productData = salesData[productName];

            // Add the total amount for each day
            for (let i = 0; i < 31; i++) {
                const day = i + 1;
                const dailyAmount = productData[day]?.total_amount || 0;
                dailyTotalAmounts[i] += dailyAmount; // Add product's daily amount to the total for that day
            }

            totalSalesAmount += Object.values(productData).reduce((acc, val) => acc + val.total_amount, 0);
        }
    
        totalSaleElement.innerText = `Total Monthly Sales: ₱${totalSalesAmount.toFixed(2)} PHP`;
    
        // Create a dataset with the total amount per day
        const datasets = [{
            label: 'Total Sales Amount per Day',
            data: dailyTotalAmounts,
            backgroundColor: getRandomColor(),
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 2,
            fill: false,  // Set fill to false for line graph
            tension: 0.4, // Adjust tension to make the line smoother
        }];
    
        if (salesChart) {
            salesChart.destroy();
        }
    
        salesChart = new Chart(ctx, {
            type: "line",  // Change chart type to "line"
            data: {
                labels,  // Days of the month
                datasets,
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return `₱${value.toFixed(2)}`;  // Format y-axis as currency
                            }
                        }
                    }
                }
            },
        });
    }

    // Helper function to generate random colors
    function getRandomColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgba(${r}, ${g}, ${b}, 0.6)`;
    }

    // Initial load and event listener for month change
    monthSelect.addEventListener("change", fetchAndRenderData);
    fetchAndRenderData(); // Load the initial chart on page load
});
