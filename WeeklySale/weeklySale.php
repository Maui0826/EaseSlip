<?php
session_start();
require "/xampp/htdocs/Ease_Slip/assets/connection.php"; // Adjust the path as needed

// Get the selected month and year from the query parameters
$selectedMonth = isset($_GET['month']) ? $_GET['month'] : date('F');
$selectedYear = isset($_GET['year']) ? $_GET['year'] : date('Y');

// Convert the month name to its respective number
$monthNumber = date('m', strtotime($selectedMonth));

// Prepare the SQL query to fetch sales data, including product price and year
$query = "
    SELECT DAY(t.sold_date) AS day, 
           SUM(t.sold) AS total_sold, 
           p.prod_name, 
           p.prod_price
    FROM transaction t
    JOIN product p ON t.productID = p.productID
    WHERE MONTH(t.sold_date) = ? AND YEAR(t.sold_date) = ?
    GROUP BY day, p.prod_name, p.prod_price
    ORDER BY day, p.prod_name
";

$stmt = $conn->prepare($query);
$stmt->bind_param('ii', $monthNumber, $selectedYear); // Bind both month and year parameters
$stmt->execute();
$result = $stmt->get_result();

// Fetch results into an associative array
$salesData = [];
while ($row = $result->fetch_assoc()) {
    $day = intval($row['day']);
    $productName = $row['prod_name'];
    $totalSold = intval($row['total_sold']);
    $price = floatval($row['prod_price']); // Ensure the price is a float

    // Calculate total amount sold for that product and day
    $totalAmount = $totalSold * $price;

    // If product name does not exist in the array, create an empty array for it
    if (!isset($salesData[$productName])) {
        $salesData[$productName] = array_fill(1, 31, ['total_sold' => 0, 'total_amount' => 0]);
    }

    // Add the new transaction's values to the existing values
    $salesData[$productName][$day]['total_sold'] += $totalSold;
    $salesData[$productName][$day]['total_amount'] += $totalAmount;
}

// Close the connection
$stmt->close();
$conn->close();

// Return the data as JSON
header('Content-Type: application/json');
echo json_encode($salesData);
?>
