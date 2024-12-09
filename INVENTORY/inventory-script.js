function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open'); // Toggle the sidebar open and close

    // Fetch username from the server and update the sidebar
    fetchUsername();
}

// Function to close the sidebar
function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.style.width = '0';  // Set sidebar width to 0 to hide it
}

// Fetch username from the server using PHP
async function fetchUsername() {
    try {
        // Use fetch to get the username from the PHP script
        const response = await fetch('./fetch-role.php');  // Adjust path as needed
        const username = await response.text();  // Expecting the username to be sent as plain text

        // Update the sidebar based on the username
        updateSidebar(username);
    } catch (error) {
        console.error('Error fetching username:', error);
    }
}

// Function to update sidebar based on account username
function updateSidebar(username) {
    const sidebarList = document.getElementById('sidebar-list');
    sidebarList.innerHTML = ''; // Clear any existing items

    if (username === 'admin') {
        // If username is admin, show full list
        const menuItems = [
            { name: 'DASHBOARD', link: '/DashboardMenu/dashboardM.html' },
            { name: 'POS', link: '/POS/billing.html' },
            { name: 'INVENTORY', link: '/INVENTORY/inventory.html' },
            { name: 'LOGOUT', link: '/DashboardMenu/logout.php', isLogout: true }
        ];
        menuItems.forEach(item => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.textContent = item.name;
            link.href = item.link;
            if (item.isLogout) {
                link.classList.add('logout');  // Add special class for logout
            }
            listItem.appendChild(link);
            sidebarList.appendChild(listItem);
        });
    } else if (username !== '') {
        // If username is not admin, show only LOGOUT
        const logoutItem = document.createElement('li');
        const logoutLink = document.createElement('a');
        logoutLink.textContent = 'LOGOUT';
        logoutLink.href = '/DashboardMenu/logout.php';
        logoutLink.classList.add('logout');  // Add special class for logout
        logoutItem.appendChild(logoutLink);
        sidebarList.appendChild(logoutItem);
    } else {
        // If no username is set (e.g., not logged in), show only LOGOUT
        const logoutItem = document.createElement('li');
        const logoutLink = document.createElement('a');
        logoutLink.textContent = 'LOGOUT';
        logoutLink.href = '/DashboardMenu/logout.php';
        logoutLink.classList.add('logout');  // Add special class for logout
        logoutItem.appendChild(logoutLink);
        sidebarList.appendChild(logoutItem);
    }
}

function fetchCategories() {
  $.get('get_categories.php', function (data) {
      const response = JSON.parse(data);
      const username = response.username;  
      const categories = response.categories;  

      
      $('#username').text(username ? `Welcome, ${username}` : 'Welcome, Guest');  

      const categoriesDiv = $('.categories');
      categories.forEach(category => {
          const button = $(`<button>${category}</button>`);
          button.click(() => fetchItems(category));
          categoriesDiv.append(button);
      });

      
      fetchItems();
  });
}



// Function to filter the items based on the search term
function searchItems() {
    const searchTerm = $('.search-bar').val().toLowerCase(); // Get the value from the search bar
    $('.card').each(function() {
        const cardName = $(this).data('name'); // Get the data-name attribute of the card (which holds the product name)
        
        // If the card name matches the search term (case-insensitive)
        if (cardName.includes(searchTerm)) {
            $(this).show(); // Show matching card
        } else {
            $(this).hide(); // Hide non-matching card
        }
    });
}

// Call the searchItems function when the user types in the search bar
$('.search-bar').on('input', function() {
    searchItems();
});

// Fetch items and render the cards
function fetchItems(category = null) {
  $.get('get_items.php', { category }, function (data) {
      const items = JSON.parse(data);
      const itemsDiv = $('.items').empty();

      items.forEach(item => {
          console.log("Image Path:", `/INVENTORY/${item.image_path}`); 

          const card = $(` 
              <div class="card" data-id="${item.id}" data-name="${item.prod_name.toLowerCase()}">
                  <img src="/INVENTORY/${item.image_path}" alt="${item.prod_name}" onerror="this.src='/INVENTORY/uploads/fallback.jpg';">
                  <h4>${item.prod_name}</h4>
                  <p>Price: ${item.prod_price} PHP</p>
                  <p>Stock: ${item.prod_quantity}</p>
              </div>
          `);

          // Add click handler for each card
          card.click(() => showItemDetails(item));

          // Append the card to the itemsDiv
          itemsDiv.append(card);
      });

      // Call searchItems to filter the cards right after fetching them
      searchItems();
  });
}


$('#update-item-button').click(function () {
    const productID = $('#item-details-container').data('item-id');  
    const prod_price = parseFloat($('#item-price').val());  
    const prod_quantity = $('#item-stock').val();
    const action = 'increase';

    if (!prod_quantity) {
        alert('Please ensure that the stock quantity is filled out.');
        return;
    }

    if (isNaN(prod_price) || prod_price < 0) {
        alert('Please enter a valid positive price.');
        return;
    }

    const data = {
        productID,
        prod_quantity,
        action,
        price: prod_price
    };

    console.log('Data sent:', data);

    $.post('/POS/update_stock.php', data, function (response) {
        alert(response);
        fetchItems(); 
    }).fail(function () {
        alert('Failed to update the item.');
    });
});


function showItemDetails(item) {
  $('#item-details-container').data('item-id', item.productID);
  $('#item-image').attr('src', `/INVENTORY/${item.image_path}`);
  $('#item-category').text(item.categoryName);
  $('#item-name').text(item.prod_name); 
  $('#item-price').val(item.prod_price);
  $('#item-stock').val(0);
}



function updateItem(itemId) {
    const updatedData = {
        name: $('#item-name').val(),
        price: parseFloat($('#item-price').val()),
        stock: parseInt($('#item-stock').val(), 10),
        itemId: itemId  
    };
  
    $.post('/POS/update_item.php', updatedData, function (response) {
       const responseData = JSON.parse(response);  
       alert(responseData.message);  
       fetchItems(); 
    }).fail(function () {
        alert('Failed to update the item.');
    });
  }
  

function renderItems(items) {
  const container = $('#items-container');
  container.empty();
  items.forEach(item => {
      const card = $(`
          <div class="card" data-name="${item.prod_name.toLowerCase()}">
              <img src="/POS/${item.image_path}" alt="${item.prod_name}">
              <h4>${item.prod_name}</h4>
              <p>Price: ${item.prod_price} PHP</p>
              <p>Stock: ${item.prod_quantity}</p>
          </div>
      `);
      container.append(card);
  });
}

$(document).ready(function () {
  renderItems(items); 

  $('.search-bar').on('input', function () {
      const searchTerm = $(this).val().toLowerCase();
      $('.items .card').each(function () {
          const itemName = $(this).data('name');
          if (itemName.includes(searchTerm)) {
              $(this).show();
          } else {
              $(this).hide();
          }
      });
  });
});

function updateGrandTotal() {
  let total = 0;
  $('#bill-body .total').each(function () {
      total += parseFloat($(this).text());
  });
  $('#subtotal').text(total.toFixed(2));
  updateInvoiceInfo();
}

function updateInvoiceInfo() {
  const totalItems = $('#bill-body tr').length;
  let totalQuantity = 0;
  $('#bill-body .qty').each(function () {
      totalQuantity += parseInt($(this).text());
  });
  $('#item-count').text(`${totalItems} Item(s)/${totalQuantity} pcs`);
}

function updateStockInDatabase(productID,prod_quantity, action) {
  $.post('/POS/update_stock.php', { productID, prod_quantity, action }, function (response) {
      if (response === 'success') {
          alert('update stock.');
      }
  });
}
function updateGrandTotal() {
  let grandTotal = 0;
  $('#bill-body tr').each(function () {
      const total = parseFloat($(this).find('.total').text());
      grandTotal += total;
  });
  $('#grand-total').text(grandTotal.toFixed(2));
}
$('#customer-payment').on('input', function () {
  const paidAmount = parseFloat($(this).val());
  const grandTotal = parseFloat($('#grand-total').text());
  const change = paidAmount >= grandTotal ? (paidAmount - grandTotal).toFixed(2) : 0.00;
  $('#change').text(change);
});
$(document).ready(fetchCategories);

function updateTransaction(productID, prod_quantity) {
  $.post('/POS/transaction.php', { 
      productID: productID, 
      prod_quantity: prod_quantity 
  }, function(response) {
      
      if (response === 'success') {
          alert('Transaction updated successfully!');
      }
  }).fail(function() {
      alert('Error with the request.');
  });
}


