document.addEventListener("DOMContentLoaded", function () {
    const ctx = document.getElementById('dailySalesChart').getContext('2d');
    const dateSelect = document.getElementById("date-select");
    const totalSaleElement = document.getElementById("totalDailySale");


    const today = new Date().toISOString().split('T')[0];

     document.getElementById('date-select').value = today;

    let dailySalesChart; // Variable to store the chart instance

    // Function to fetch and render data
    async function fetchAndRenderData() {
        const selectedDate = dateSelect.value;
        if (!selectedDate) return; // Exit if no date is selected

        try {
            const response = await fetch(`dailySale.php?date=${selectedDate}`);
            const salesData = await response.json();
            console.log(salesData); // Check the fetched data

        if (Object.keys(salesData).length === 0) {
            alert("No sales data available for this day.");
            return;
        }

        let totalSalesAmount = 0;

        // Get product names and their corresponding total amounts
        const productNames = Object.keys(salesData);
        const dailyTotalAmounts = productNames.map(productName => {
            const dailyAmount = salesData[productName].total_amount;
            totalSalesAmount += dailyAmount; // Add to total sales
            return { productName, dailyAmount };
        });
        
        // Sort products by their sales amounts in ascending order
        dailyTotalAmounts.sort((a, b) => a.dailyAmount - b.dailyAmount);
        
        const sortedProductNames = dailyTotalAmounts.map(item => item.productName);
        const sortedDailyTotalAmounts = dailyTotalAmounts.map(item => item.dailyAmount);
        
        totalSaleElement.innerText = `Total Daily Sales: ₱${totalSalesAmount.toFixed(2)} PHP`;
        

            // Generate unique random colors for each bar
            const backgroundColors = sortedProductNames.map(() => getRandomColor());

            const datasets = [{
                label: 'Total Sales Amount per Product',
                data: sortedDailyTotalAmounts,
                backgroundColor: backgroundColors,
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 2,
                fill: false,
                tension: 0.4
            }];

            if (dailySalesChart) {
                dailySalesChart.destroy();
            }

            dailySalesChart = new Chart(ctx, {
                type: "bar",
                data: {
                    labels: sortedProductNames,
                    datasets: datasets
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return `₱${value.toFixed(2)}`;
                                }
                            }
                        }
                    }
                }
            });

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    // Helper function to generate random colors
    function getRandomColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgba(${r}, ${g}, ${b}, 0.6)`;  // Slight transparency for better visual effect
    }

    // Initial load and event listener for date change
    dateSelect.addEventListener("change", fetchAndRenderData);
    fetchAndRenderData(); // Load the initial chart on page load
});

