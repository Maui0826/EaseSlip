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
        const labels = Array.from({ length: 31 }, (_, i) => `${i + 1}`);
        let datasets = [];
        let totalSalesAmount = 0;
    
        for (const productName in salesData) {
            const productData = salesData[productName];
            const salesValues = labels.map(day => productData[day]?.total_sold || 0);
            const totalAmounts = labels.map(day => productData[day]?.total_amount || 0);
    
            totalSalesAmount += totalAmounts.reduce((a, b) => a + b, 0);
    
            datasets.push({
                label: productName,
                data: salesValues,
                backgroundColor: getRandomColor(),
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
            });
        }
    
        totalSaleElement.innerText = `Total Monthly Sales: ₱${totalSalesAmount.toFixed(2)} PHP`;
    
        if (salesChart) {
            salesChart.destroy();
        }
    
        salesChart = new Chart(ctx, {
            type: "bar",
            data: { labels, datasets },
            options: { scales: { y: { beginAtZero: true } } },
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
