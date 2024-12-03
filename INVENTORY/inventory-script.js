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
  $.get('/POS/get_categories.php', function (data) {
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


function fetchItems(category = null) {
  $.get('/POS/get_items.php', { category }, function (data) {
      const items = JSON.parse(data);
      const itemsDiv = $('.items').empty();

      items.forEach(item => {
          console.log("Image Path:", `/POS/${item.image_path}`); 

          const card = $(` 
              <div class="card" data-id="${item.id}">
                  <img src="/POS/${item.image_path}" alt="${item.prod_name}" onerror="this.src='/POS/images/fallback.jpg';">
                  <h4>${item.prod_name}</h4>
                  <p>Price: ${item.prod_price} PHP</p>
                  <p>Stock: ${item.prod_quantity}</p>
              </div>
          `);

          card.click(() => showItemDetails(item));
          itemsDiv.append(card);
      });
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

    $.post('update_stock.php', data, function (response) {
        alert(response);
        fetchItems(); 
    }).fail(function () {
        alert('Failed to update the item.');
    });
});




function showItemDetails(item) {
  $('#item-details-container').data('item-id', item.productID);
  $('#item-image').attr('src', `/POS/${item.image_path}`);
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


function printReceipt() {
  const billBody = $('#bill-body');
  const rows = billBody.find('tr');
  if (rows.length === 0) {
      alert('No items in the bill.');
      return;
  }

  let grandTotal = 0;
  let receiptContent = `
      <div style="font-family: monospace; padding: 20px; width: 300px;">
          <h2 style="text-align: center; border-bottom: 1px solid #000; padding-bottom: 10px; margin-bottom: 20px;">
              EASELIP
          </h2>
          <p style="text-align: center; font-size: 14px; margin-bottom: 20px;">Easlip inc. Philippines</p>
          <p style="text-align: center; font-size: 14px; margin-bottom: 20px;">Tel: (123) 456-7890</p>
          <div style="border-bottom: 1px solid #000; margin-bottom: 10px;"></div>
          <table style="width: 100%; font-size: 14px; margin-bottom: 20px; border-collapse: collapse;">
              <thead>
                  <tr style="border-bottom: 1px solid #000;">
                      <th style="text-align: left;">Item</th>
                      <th style="text-align: center;">Qty</th>
                      <th style="text-align: right;">Total</th>
                  </tr>
              </thead>
              <tbody>
  `;

  rows.each(function () {
      const name = $(this).find('td:nth-child(2)').text(); 
      const qty = parseInt($(this).find('.qty').text());
      const total = parseFloat($(this).find('.total').text());
      grandTotal += total;

      
      const itemId = $(this).data('id');
      const itemPrice = parseFloat($(this).find('.total').text()) / qty;
      updateStockInDatabase(itemId, qty, 'decrease');
      updateTransaction(itemId,qty);
      receiptContent += `
          <tr>
              <td>${name}</td>
              <td style="text-align: center;">${qty}</td>
              <td style="text-align: right;">${total.toFixed(2)} PHP</td>
          </tr>
      `;
  });

  const paidAmount = parseFloat($('#customer-payment').val()) || 0;
  const change = paidAmount >= grandTotal ? (paidAmount - grandTotal).toFixed(2) : 0.00;

  receiptContent += `
              </tbody>
          </table>
          <div style="border-bottom: 1px solid #000; margin-bottom: 10px;"></div>
          <p style="text-align: right; font-size: 14px;">
              <strong>Grand Total:</strong>
              <span style="font-size: 16px; font-weight: bold;">${grandTotal.toFixed(2)} PHP</span>
          </p>
          <p style="text-align: right; font-size: 14px;">
              <strong>Amount Paid:</strong>
              <span style="font-size: 16px; font-weight: bold;">${paidAmount.toFixed(2)} PHP</span>
          </p>
          <p style="text-align: right; font-size: 14px;">
              <strong>Change:</strong>
              <span style="font-size: 16px; font-weight: bold;">${change} PHP</span>
          </p>
          <div style="border-bottom: 1px solid #000; margin-bottom: 10px;"></div>
          <p style="text-align: center; margin-top: 20px;">Thank you for shopping with us!</p>
      </div>
  `;

  const newWindow = window.open('', '_blank', 'width=400,height=600');
  newWindow.document.write(receiptContent);
  newWindow.document.close();
  newWindow.print();
  newWindow.close();
  clearBasket();
  fetchItems();
}

function clearBasket() {
  
  $('#bill-body').empty();

  
  $('#grand-total').text('0.00');
  $('#subtotal').text('0.00');

  
  $('#item-count').text('0 Item(s)/0 pcs');

  
  $('#customer-payment').val('');
  $('#change').text('0.00');
}

$('#checkout-button').click(printReceipt);

