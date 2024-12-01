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
        const categories = JSON.parse(data);
        const categoriesDiv = $('.categories');
        categories.forEach(category => {
            const button = $(`<button>${category}</button>`);
            button.click(() => fetchItems(category));
            categoriesDiv.append(button);
        });
        fetchItems(); // 
    });
}

function fetchItems(category = null) {
    $.get('get_items.php', { category }, function (data) {
        const items = JSON.parse(data);
        const itemsDiv = $('.items').empty();
        items.forEach(item => {
            const card = $(`
                <div class="card" data-id="${item.id}" data-name="${item.name.toLowerCase()}">
                    <img src="${item.image_path}" alt="${item.name}">
                    <h4>${item.name}</h4>
                    <p>Price: ${item.price} PHP</p>
                    <p>Stock: ${item.quantity}</p>
                </div>
            `);

            if (item.quantity === 0) {
                card.css('opacity', 0.5);
            }

            card.click(() => addToBill(item));
            itemsDiv.append(card);
        });
    });
}

function addToBill(item) {
    if (item.quantity <= 0) {
        alert('This item is out of stock.');
        return;
    }

    const billBody = $('#bill-body');
    const existingRow = billBody.find(`tr[data-id="${item.id}"]`);

    if (existingRow.length > 0) {
        const qtyCell = existingRow.find('.qty');
        const totalCell = existingRow.find('.total');
        const newQty = parseInt(qtyCell.text()) + 1;

        if (newQty > item.quantity) {
            alert('Insufficient stock!');
            return;
        }
        qtyCell.text(newQty);
        totalCell.text((newQty * item.price).toFixed(2));

        item.quantity--;
        if (item.quantity === 0) {
            const itemCard = $(`.card[data-id="${item.id}"]`);
            itemCard.css('opacity', 0.5);
        }

        updateGrandTotal();
        updateInvoiceInfo();
    } else {
        const row = $(`
            <tr data-id="${item.id}">
                <td><img src="${item.image_path}" alt="${item.name}"></td>
                <td>${item.name}</td>
                <td class="qty-actions">
                    <button class="decrease">-</button>
                    <span class="qty">1</span>
                    <button class="increase">+</button>
                </td>
                <td class="total">${item.price}</td>
            </tr>
        `);

        row.find('.decrease').click(function () {
            const qtyCell = $(this).closest('tr').find('.qty');
            const totalCell = $(this).closest('tr').find('.total');
            let qty = parseInt(qtyCell.text());

            if (qty > 1) {
                qty--;
                qtyCell.text(qty);
                totalCell.text((qty * item.price).toFixed(2));
                item.quantity++;
            } else {
                $(this).closest('tr').remove();
            }
            updateGrandTotal();
            updateInvoiceInfo();
        });

        row.find('.increase').click(function () {
            const qtyCell = $(this).closest('tr').find('.qty');
            const totalCell = $(this).closest('tr').find('.total');
            let qty = parseInt(qtyCell.text());

            if (qty < item.quantity) {
                qty++;
                qtyCell.text(qty);
                totalCell.text((qty * item.price).toFixed(2));
                item.quantity--;

                if (item.quantity === 0) {
                    const itemCard = $(`.card[data-id="${item.id}"]`);
                    itemCard.css('opacity', 0.5);
                }
            } else {
                alert('Insufficient stock!');
            }
            updateGrandTotal();
            updateInvoiceInfo();
        });

        billBody.append(row);
    }

    updateGrandTotal();
    updateInvoiceInfo();
}





function renderItems(items) {
    const container = $('#items-container');
    container.empty();
    items.forEach(item => {
        const card = $(`
            <div class="card" data-name="${item.name.toLowerCase()}">
                <img src="${item.image_path}" alt="${item.name}">
                <h4>${item.name}</h4>
                <p>Price: ${item.price} PHP</p>
                <p>Stock: ${item.quantity}</p>
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

function updateStockInDatabase(itemId, quantity, action) {
    $.post('update_stock.php', { itemId, quantity, action }, function (response) {
        if (response !== 'success') {
            alert('Failed to update stock.');
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

        // Update stock in the database when printing the receipt
        const itemId = $(this).data('id');
        const itemPrice = parseFloat($(this).find('.total').text()) / qty;

        // Update stock for each item in the receipt
        updateStockInDatabase(itemId, qty, 'decrease');

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
}


$('#checkout-button').click(printReceipt);
$('#all-categories-button').click(function () {
    fetchItems();
});