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
    url: '/MonthlySale/monthlySale.php',
    method: 'GET',
    success: (response) => {
      mainSection.innerHTML =     `
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
      </div>`; // Load content from PHP dynamically
      loadAssets(); // Load associated CSS and JS
    },
    error: (xhr, status, error) => {
      console.error(`Error: ${error}, Status: ${status}`);
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

// Tab click event handler
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // Remove active class from all tabs
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    // Update the main content based on the tab
    const tabName = tab.querySelector('span').textContent;
    if (tab.id === 'logout-tab') {
      mainSection.innerHTML = `<h2>Goodbye!</h2><p>You have successfully logged out.</p>`;
    } else if (tab.id === 'monthly-sales-tab') {
      loadMonthlySales(); // Insert Monthly Sales HTML
      loadAssets(); // Load associated assets
    } else {
      mainSection.innerHTML = `<h2>${tabName}</h2><p>Details about ${tabName} will appear here.</p>`;
    }
  });
});

// Fetch Overview Data
document.addEventListener('DOMContentLoaded', () => {
  fetchOverviewData();
});

function fetchOverviewData() {
  $.ajax({
    url: 'fetch_overview.php',
    method: 'GET',
    dataType: 'json',
    success: (data) => {
      $('#revenue-data').text(data.revenue);
      $('#profit-data').text(data.profit);
      $('#time-data').text(data.time_sold);
      $('#growth-data').text(data.growth);
    },
    error: () => {
      alert('Failed to fetch data');
    },
  });
}
