document.addEventListener("DOMContentLoaded", function () {
    const ctx = document.getElementById('dailySalesChart').getContext('2d');
    const dateSelect = document.getElementById("date-select");
    const totalSaleElement = document.getElementById("totalDailySale");
    let dailySalesChart; // Variable to store the chart instance

    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date-select').value = today;

    async function fetchAndRenderData() {
        const selectedDate = dateSelect.value;
        if (!selectedDate) return;

        try {
            const response = await fetch(`dailySale.php?date=${selectedDate}`);
            const salesData = await response.json();
            console.log(salesData);

            if (Object.keys(salesData).length === 0) {
                alert("No sales data available for this day.");

                // Clear the chart bars only without destroying the chart instance
                dailySalesChart.data.labels = [];
                dailySalesChart.data.datasets = [{
                    label: 'Total Sales Amount per Product',
                    data: [],
                    backgroundColor: [],
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4
                }];
                dailySalesChart.update();  // Update the chart with empty data

                totalSaleElement.innerText = '';  // Clear the total sales amount text
                return;
            }

            let totalSalesAmount = 0;

            const productNames = Object.keys(salesData);
            const dailyTotalAmounts = productNames.map(productName => {
                const dailyAmount = salesData[productName].total_amount;
                totalSalesAmount += dailyAmount;
                return { productName, dailyAmount };
            });

            dailyTotalAmounts.sort((a, b) => a.dailyAmount - b.dailyAmount);

            const sortedProductNames = dailyTotalAmounts.map(item => item.productName);
            const sortedDailyTotalAmounts = dailyTotalAmounts.map(item => item.dailyAmount);

            totalSaleElement.innerText = `Total Daily Sales: ₱${totalSalesAmount.toFixed(2)} PHP`;

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
                dailySalesChart.data.labels = sortedProductNames;
                dailySalesChart.data.datasets = datasets;
                dailySalesChart.update();  // Refresh the chart with new data
            } else {
                dailySalesChart = new Chart(ctx, {
                    type: "bar",
                    data: {
                        labels: sortedProductNames,
                        datasets: datasets
                    }
                });
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    function getRandomColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgba(${r}, ${g}, ${b}, 0.6)`;
    }

    dateSelect.addEventListener("change", fetchAndRenderData);
    fetchAndRenderData();  // Initial chart load
});

