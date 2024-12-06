document.addEventListener("DOMContentLoaded", function () {
    const ctx = document.getElementById("salesChart").getContext("2d"); // Get the canvas context
    const monthSelect = document.getElementById("month-select");
    const weekSelect = document.getElementById("week-range");
    const yearSelect = document.getElementById("year-select");
    const totalWeeklySaleElement = document.getElementById("totalWeeklySale");

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

    // Helper function to generate random colors
    function getRandomColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgba(${r}, ${g}, ${b}, 0.6)`;
    }

    async function fetchAndRenderData() {
        const selectedMonth = monthSelect.value;
        const selectedWeek = parseInt(weekSelect.value.replace('Week ', ''), 10); // Get week number
        const selectedYear = yearSelect.value;

        const response = await fetch(`weeklySale.php?month=${selectedMonth}&week=${selectedWeek}&year=${selectedYear}`);
        const data = await response.json();
        console.log(data); // Debugging: log the raw data

        // If no data, alert the user and display an empty chart
        if (Object.keys(data).length === 0) {
            alert("No sales data available for this month.");
            
            // Show a data-less chart
            const labels = Array.from({ length: 31 }, (_, i) => `${i + 1}`);  // Days 1-31
            const emptyData = Array(31).fill(0); // Initialize empty data array with 0s
            
            // Destroy previous chart instance if exists
            if (window.salesChartInstance) {
                window.salesChartInstance.destroy();
            }

            // Create an empty chart
            window.salesChartInstance = new Chart(ctx, {
                type: "bar",
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Total Sales Amount Per Day',
                        data: emptyData,
                        backgroundColor: emptyData.map(() => getRandomColor()),
                        borderColor: emptyData.map(() => getRandomColor()),
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Date'
                            }
                        },
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Sales Amount (₱)'
                            },
                            ticks: {
                                callback: function (value) {
                                    return `₱${value.toFixed(2)}`; // Format Y-axis as currency
                                }
                            }
                        }
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    return `₱${context.raw.toFixed(2)} PHP`; // Format tooltip value
                                }
                            }
                        }
                    }
                }
            });

            // Display total weekly sale as 0
            totalWeeklySaleElement.innerText = `Total Weekly Sale: ₱0.00 PHP`;
            return; // Exit the function as no data is available
        }

        // Determine the start and end dates of the selected week
        const monthNumber = new Date(Date.parse(`${selectedMonth} 1`)).getMonth();
        const startDate = new Date(selectedYear, monthNumber, (selectedWeek - 1) * 7 + 1);
        const endDate = new Date(selectedYear, monthNumber, selectedWeek * 7);

        // Prepare data for the chart
        const labels = []; // Exact dates in the selected week (YYYY-MM-DD)
        const salesData = []; // Total sales amount per day in the selected week
        let totalWeeklySale = 0;

        // Populate data for the 7 days of the week
        for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
            const day = date.getDate(); // Day of the month
            const formattedDate = date.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
            labels.push(formattedDate);

            let dailyTotal = 0;
            // Aggregate sales for this day across all products
            Object.keys(data).forEach(productName => {
                if (data[productName][day]) {
                    dailyTotal += data[productName][day].total_amount;
                }
            });

            salesData.push(dailyTotal); // Add total sales for this day
            totalWeeklySale += dailyTotal; // Update total weekly sale
        }

        // Generate a unique color for each bar
        const barColors = labels.map(() => getRandomColor());

        // Display total weekly sale
        totalWeeklySaleElement.innerText = `Total Weekly Sale: ₱${totalWeeklySale.toFixed(2)} PHP`;

        // Create or update the chart
        if (window.salesChartInstance) {
            window.salesChartInstance.destroy(); // Destroy previous instance if exists
        }

        window.salesChartInstance = new Chart(ctx, {
            type: "bar", // Bar chart type
            data: {
                labels: labels,
                datasets: [{
                    label: 'Total Sales Amount Per Day',
                    data: salesData,
                    backgroundColor: barColors,
                    borderColor: barColors.map(color => color.replace('0.6', '1')), // Use darker border for borders
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Sales Amount (₱)'
                        },
                        ticks: {
                            callback: function (value) {
                                return `₱${value.toFixed(2)}`; // Format Y-axis as currency
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return `₱${context.raw.toFixed(2)} PHP`; // Format tooltip value
                            }
                        }
                    }
                }
            }
        });
    }
});
