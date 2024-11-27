
function addNewField() {
  var container = document.getElementById("extra-fields-container");

  // Create a new label and input element for the new field
  var newLabel = document.createElement("label");
  newLabel.innerHTML = "Additional Info: ";

  var newInput = document.createElement("input");
  newInput.type = "text";
  newInput.className = "extra-field";
  newInput.placeholder = "Enter data";

  // Append the new label and input to the container
  container.appendChild(newLabel);
  container.appendChild(newInput);

  // Add a line break for better layout
  container.appendChild(document.createElement("br"));

  // Update the table headers
  var tableHeaders = document.getElementById("table-headers");
  var newHeader = document.createElement("th");
  newHeader.innerHTML = "Additional Info";
  tableHeaders.appendChild(newHeader);
}

function addPurchase() {
  // Collect form values
  const date = document.purchases.date.value;
  const product = document.purchases.product.value;
  const quantity = document.purchases.quantity.value;
  const unitCost = document.purchases.unitCost.value;
  const totalCost = document.purchases.totalCost.value;

  // Collect dynamically added field values
  const extraFields = document.querySelectorAll(".extra-field");
  let extraFieldValues = Array.from(extraFields).map(
    (field) => field.value
  );

  // Create a new table row
  const tr = document.createElement("tr");

  // Add cells for standard fields
  const td1 = tr.appendChild(document.createElement("td"));
  const td2 = tr.appendChild(document.createElement("td"));
  const td3 = tr.appendChild(document.createElement("td"));
  const td4 = tr.appendChild(document.createElement("td"));
  const td5 = tr.appendChild(document.createElement("td"));

  td1.innerHTML = date;
  td2.innerHTML = product;
  td3.innerHTML = quantity;
  td4.innerHTML = unitCost;
  td5.innerHTML = totalCost;

  // Add cells for extra fields
  extraFieldValues.forEach((value) => {
    const extraTd = tr.appendChild(document.createElement("td"));
    extraTd.innerHTML = value;
  });

  // Append the new row to the table
  document.getElementById("tbl").appendChild(tr);
}
function addSales() {
  // Collect form values
  const date = document.sales.date.value;
  const expense = document.sales.expense.value;
  const sales = document.sales.sales.value;
  const amount = document.sales.amount.value;

  // Collect dynamically added field values
  const extraFields = document.querySelectorAll(".extra-field");
  let extraFieldValues = Array.from(extraFields).map(
    (field) => field.value
  );

  // Create a new table row
  const tr = document.createElement("tr");

  // Add cells for standard fields
  const td1 = tr.appendChild(document.createElement("td"));
  const td2 = tr.appendChild(document.createElement("td"));
  const td3 = tr.appendChild(document.createElement("td"));
  const td4 = tr.appendChild(document.createElement("td"));

  td1.innerHTML = date;
  td2.innerHTML = expense;
  td3.innerHTML = sales;
  td4.innerHTML = amount;

  // Add cells for extra fields
  extraFieldValues.forEach((value) => {
    const extraTd = tr.appendChild(document.createElement("td"));
    extraTd.innerHTML = value;
  });

  // Append the new row to the table
  document.getElementById("tbl2").appendChild(tr);
}
function addStocks() {
  // Collect form values
  const product = document.stocks.product.value;
  const quantity = document.stocks.quantity.value;
  const unitPrice = document.stocks.unitPrice.value;

  // Collect dynamically added field values
  const extraFields = document.querySelectorAll(".extra-field");
  let extraFieldValues = Array.from(extraFields).map(
    (field) => field.value
  );

  // Create a new table row
  const tr = document.createElement("tr");

  // Add cells for standard fields
  const td1 = tr.appendChild(document.createElement("td"));
  const td2 = tr.appendChild(document.createElement("td"));
  const td3 = tr.appendChild(document.createElement("td"));

  td1.innerHTML = product;
  td2.innerHTML = quantity;
  td3.innerHTML = unitPrice;

  // Add cells for extra fields
  extraFieldValues.forEach((value) => {
    const extraTd = tr.appendChild(document.createElement("td"));
    extraTd.innerHTML = value;
  });

  // Append the new row to the table
  document.getElementById("tbl3").appendChild(tr);
}
