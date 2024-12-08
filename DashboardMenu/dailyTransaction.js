document.addEventListener("DOMContentLoaded", function () {
    const dateSelect = document.getElementById("date-select");
    const transactionTable = document.getElementById("transaction-table").querySelector("tbody");

    // Set the current date as the default value
    const currentDate = new Date().toISOString().split('T')[0];
    dateSelect.value = currentDate;

    // Fetch and display transactions for the selected date
    async function fetchTransactions() {
        const date = dateSelect.value;
        if (!date) {
            transactionTable.innerHTML = "<tr><td colspan='7'>Please select a date.</td></tr>";
            return;
        }

        try {
            const response = await fetch(`fetchTransaction.php?date=${date}`);
            const data = await response.json();

            if (data.error) {
                transactionTable.innerHTML = `<tr><td colspan='7'>${data.error}</td></tr>`;
                return;
            }

            transactionTable.innerHTML = ""; // Clear table before adding new rows
            data.forEach(transaction => {
                const row = document.createElement("tr");

                row.innerHTML = `  
                    <td>${transaction.transactionID}</td>
                    <td>${transaction.prod_name}</td>
                    <td>₱${transaction.prod_price.toFixed(2)}</td>
                    <td>${transaction.sold}</td>
                    <td>₱${(transaction.prod_price * transaction.sold).toFixed(2)}</td>
                    <td>${transaction.username}</td> <!-- Display username -->
                    <td>
                        <button class="delete-btn" data-id="${transaction.transactionID}">Delete</button>
                    </td>
                `;

                transactionTable.appendChild(row);
            });

            // Add delete functionality
            document.querySelectorAll(".delete-btn").forEach(button => {
                button.addEventListener("click", async function () {
                    const transactionID = this.getAttribute("data-id");
                    await deleteTransaction(transactionID);
                });
            });

        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    }

    // Delete a transaction
    async function deleteTransaction(transactionID) {
        try {
            const response = await fetch("deleteTransaction.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `transactionID=${transactionID}`
            });

            const result = await response.json();

            if (result.success) {
                alert(result.message);
                fetchTransactions(); // Refresh the table
            } else {
                alert(result.message);
            }

        } catch (error) {
            console.error("Error deleting transaction:", error);
        }
    }

    // Fetch transactions when the date changes
    dateSelect.addEventListener("change", fetchTransactions);

    // Fetch transactions on page load with the current date
    fetchTransactions();
});
