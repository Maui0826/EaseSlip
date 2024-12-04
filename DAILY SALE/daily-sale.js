document.addEventListener("DOMContentLoaded", function () {
    const ctx = document.getElementById("salesChart").getContext("2d");
    const dateInput = document.querySelector("#dateInput"); // Reference the input field
    const totalSaleElement = document.querySelector("#totalDailySale"); // Reference the total sales h3 element
  
    dateInput.addEventListener("change", fetchAndRenderData); // Trigger data load on date change
  
    // Function to fetch and render data
    async function fetchAndRenderData() {
      const selectedDate = dateInput.value;
      const response = await fetch(`daily-sale.php?date=${selectedDate}`);
      
      // Log the response to check if it's valid
      const text = await response.text(); // Get raw response text
      console.log(text);  // Log raw response to see if it's valid JSON
  
      try {
        const salesData = JSON.parse(text); // Attempt to parse the response as JSON
  
        if (salesData && Object.keys(salesData).length === 0) {
          console.error("No sales data available for this date.");
          alert("No sales data available for this date.");
          totalSaleElement.innerText = "Total Daily Sales: 0"; // Update the total sales to 0 if no data
          return;
        }
  
        // Prepare chart data
        const labels = Array.from({ length: 24 }, (_, i) => `${i}:00`); // Labels for hours (0 to 23)
        const datasets = [];
        let totalSales = 0; // Variable to store total sales
  
        // Iterate over each product and prepare dataset
        for (const productName in salesData) {
          const salesValues = Array(24).fill(0); // Initialize all hours with 0
  
          // Fill in sales data for each product based on the hour
          for (const hour in salesData[productName]) {
            const sales = salesData[productName][hour];
            const totalSold = parseInt(sales.total_sold); // Ensure total sold is an integer
            const price = parseFloat(sales.price); // Ensure price is a float
            salesValues[hour] = totalSold;
            
            // Accumulate the total sales for the product (total sold * price)
            totalSales += totalSold * price;
          }
  
          // Add dataset for each product
          datasets.push({
            label: productName,
            data: salesValues,
            backgroundColor: getRandomColor(),
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          });
        }
        
        // Update the total sales in the h3 element
        totalSaleElement.innerText = `Total Daily Sales: ₱${totalSales.toFixed(2)}`;
        
        // Create or update the chart
        if (window.salesChartInstance) {
          window.salesChartInstance.destroy(); // Destroy previous instance if exists
        }
  
        window.salesChartInstance = new Chart(ctx, {
          type: "bar",
          data: {
            labels: labels,
            datasets: datasets,
          },
          options: {
            scales: {
              y: { beginAtZero: true },
            },
          },
        });
      } catch (e) {
        console.error("Error parsing JSON response:", e);
        alert("An error occurred while fetching the sales data. Please try again later.");
      }
    }
  
    // Helper function to generate random colors for each product
    function getRandomColor() {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      return `rgba(${r}, ${g}, ${b}, 0.6)`;
    }
  
    // Load chart for the current date initially
    dateInput.value = new Date().toISOString().split('T')[0]; // Set the input field to the current date
    fetchAndRenderData();
});


  
  