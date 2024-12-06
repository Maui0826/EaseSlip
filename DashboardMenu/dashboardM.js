function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.style.width = sidebar.style.width === "250px" ? "0" : "250px";
}

function closeSidebar() {
  document.getElementById("sidebar").style.width = "0";
}

const tabs = document.querySelectorAll('.sidebar ul li');
const mainSection = document.getElementById('main-section');

// Function to dynamically load Monthly Sales Content
const loadMonthlySales = () => {
  $.ajax({
    url: '/MonthlySale/monthlySale.php', // Adjust the path if needed
    method: 'GET',
    success: (response) => {
      mainSection.innerHTML = `
        <h1>Monthly SALE DASHBOARD</h1>
        <div class="MonthlySale-container">
            <div class="monthly-calendar">
                <label for="month-select">Month:</label>
                <select id="month-select">
                  <option value="January">January</option>
                  <option value="February">February</option>
                  <option value="March">March</option>
                  <option value="April">April</option>
                  <option value="May">May</option>
                  <option value="June">June</option>
                  <option value="July">July</option>
                  <option value="August">August</option>
                  <option value="September">September</option>
                  <option value="October">October</option>
                  <option value="November">November</option>
                  <option value="December">December</option>
                </select>
            </div>
            <div class="monthlySale-chart">
                <canvas id="salesChart"></canvas>
            </div>
            <div class="monthlySaleTotal">
                <h3 id="totalmonthlySale">Total Monthly Sales: ₱0</h3>
            </div>
        </div>
      `;

      // Call function to load the chart with data
      loadSalesChart(response);
    },
    error: () => {
      mainSection.innerHTML = `<h2>Error</h2><p>Failed to load Monthly Sales data.</p>`;
    }
  });
};

// Function to dynamically load CSS and JS
const loadAssets = () => {
  if (!document.querySelector('link[href="/MonthlySale/monthlySale.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/MonthlySale/monthlySale.css';
    document.head.appendChild(link);
  }
  if (!document.querySelector('script[src="/MonthlySale/monthlySale.js"]')) {
    const script = document.createElement('script');
    script.src = '/MonthlySale/monthlySale.js';
    script.defer = true;
    document.body.appendChild(script);
  }
};

// Function to render the sales chart
const loadSalesChart = (salesData) => {
  const ctx = document.getElementById('salesChart').getContext('2d');
  const labels = [];
  const datasets = [];

  // Prepare the chart labels (days of the month)
  for (let day = 1; day <= 31; day++) {
    labels.push(day);
  }

  // Prepare the chart datasets (sales for each product)
  Object.keys(salesData).forEach(productName => {
    const productData = salesData[productName];
    const salesValues = [];

    for (let day = 1; day <= 31; day++) {
      salesValues.push(productData[day].total_amount);
    }

    datasets.push({
      label: productName,
      data: salesValues,
      fill: false,
      borderColor: getRandomColor(),
      tension: 0.1
    });
  });

  // Render the chart
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: datasets
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              return `₱${tooltipItem.raw.toFixed(2)}`;
            }
          }
        }
      }
    }
  });
};

// Function to generate random color for each product line in chart
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // Remove active class from all tabs
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    // Update the main content based on the tab
    const tabName = tab.querySelector('span').textContent;

    if (tab.id === 'logout-tab') {
      mainSection.innerHTML = `<h2>Goodbye!</h2><p>You have successfully logged out.</p>`;
    } else if (tab.id === 'inventory-tab') {
      window.location.href = '/INVENTORY/inventory.html'; // Navigate to Inventory page
    } else if (tab.id === 'pos-tab') {
      window.location.href = '/POS/billing.html'; // Navigate to POS page
    } else if (tab.id === 'daily-sales-tab') {
      window.location.href = '/DAILY SALE/daily-sale.html'; // Navigate to Daily Sales page
    } else if (tab.id === 'daily-product-sales-tab') {
      window.location.href = '/DAILY PRODUCT SALE/daily-product-sale.html'; // Navigate to Daily Product Sales page
    } else if (tab.id === 'weekly-sales-tab') {
      window.location.href = '/WeeklySale/weeklySale.html'; // Navigate to Weekly Sales page
    } else if (tab.id === 'weekly-product-sales-tab') {
      window.location.href = '/WeeklyProductSale/weeklyProductSale.html'; // Navigate to Weekly Product Sales page
    } else if (tab.id === 'monthly-sales-tab') {
      window.location.href = '/MonthlySale/monthlySale.html'; // Navigate to Monthly Sales page
    } else if (tab.id === 'monthly-product-sales-tab') {
      window.location.href = '/MonthlyProductSale/montlyProductSale.html'; // Navigate to Monthly Product Sales page
    } else {
      mainSection.innerHTML = `<h2>${tabName}</h2><p>Details about ${tabName} will appear here.</p>`;
    }
  });
});
