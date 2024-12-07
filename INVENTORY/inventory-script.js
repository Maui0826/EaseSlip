function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  if (sidebar.style.width === "250px") {
      sidebar.style.width = "0";
  } else {
      sidebar.style.width = "250px";
  }
}

function closeSidebar() {
  document.getElementById("sidebar").style.width = "0";
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
                  <img src="/INVENTORY/${item.image_path}" alt="${item.prod_name}" onerror="this.src='/POS/uploads/fallback.jpg';">
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
    const price = $('#item-price').val();
    const stock = $('#item-stock').val();

    
    if (!stock) {
        alert('Please ensure that the stock quantity is filled out.');
        return;
    }

    
    const data = {
      productID,   
      stock        
    };
    
    
    if (price) {
        data.price = price;
    }

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
  $('#item-stock').val(item.prod_quantity);
}



function updateItem(itemId) {
    const updatedData = {
        name: $('#item-name').val(),
        price: parseFloat($('#item-price').val()),
        stock: parseInt($('#item-stock').val(), 10),
        itemId: itemId  
    };
  
    $.post('update_item.php', updatedData, function (response) {
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


