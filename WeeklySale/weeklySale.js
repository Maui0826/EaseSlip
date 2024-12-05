document.addEventListener("DOMContentLoaded", function () {
    const ctx = document.getElementById("salesChart").getContext("2d");
    const monthSelect = document.getElementById("month-select");
    const weekSelect = document.getElementById("week-range");
    const totalWeeklySaleElement = document.getElementById("totalWeeklySale");

    monthSelect.addEventListener("change", fetchAndRenderData);
    weekSelect.addEventListener("change", fetchAndRenderData);

    // Initial load
    fetchAndRenderData();

    // Helper function to generate random colors
    function getRandomColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgba(${r}, ${g}, ${b}, 0.6)`;
    }

    async function fetchAndRenderData() {
        const selectedMonth = monthSelect.value;
        const selectedWeek = weekSelect.value.replace('Week ', ''); // Get week number

        const response = await fetch(`weeklySale.php?month=${selectedMonth}&week=${selectedWeek}`);
        const data = await response.json();
        console.log(data);  // Debugging: log the raw data

        // Prepare data for the chart
        const productNames = Object.keys(data);
        const totalSold = productNames.map(product => data[product].total_sold);
        const totalPrices = productNames.map(product => data[product].total_price);

        // Calculate the total weekly sale
        const totalWeeklySale = totalPrices.reduce((acc, price) => acc + parseFloat(price), 0);
        totalWeeklySaleElement.innerText = `Total Weekly Sale: ${totalWeeklySale.toFixed(2)} PHP`;

        // Generate random colors for each product
        const randomColors = productNames.map(() => getRandomColor());

        // Create or update the chart
        if (window.salesChartInstance) {
            window.salesChartInstance.destroy(); // Destroy previous instance if exists
        }

        window.salesChartInstance = new Chart(ctx, {
            type: "bar",
            data: {
                labels: productNames,
                datasets: [{
                    label: 'Total Sold',
                    data: totalSold,
                    backgroundColor: randomColors,  // Use the random colors for each bar
                    borderColor: randomColors.map(color => color.replace('0.6', '1')), // Make the border darker
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
});

