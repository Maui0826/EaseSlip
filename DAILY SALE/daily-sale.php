<?php
session_start();
require "/xampp/htdocs/Ease_Slip/assets/connection.php";

// Get the selected date from the query parameter
$date = isset($_GET['date']) ? $_GET['date'] : date('Y-m-d');

// Prepare the SQL statement
$query = "
    SELECT HOUR(t.sold_date) AS hour, p.prod_name, p.prod_price, SUM(t.sold) AS total_sold
    FROM transaction t
    JOIN product p ON t.productID = p.productID
    WHERE DATE(t.sold_date) = ?
    GROUP BY hour, p.prod_name, p.prod_price
    ORDER BY hour, p.prod_name
";


// Use prepared statement to prevent SQL injection
$stmt = $conn->prepare($query);
$stmt->bind_param('s', $date);
$stmt->execute();
$result = $stmt->get_result();

// Fetch results into an array, separated by product name
$salesData = array();
while ($row = $result->fetch_assoc()) {
    $hour = $row['hour'];
    $productName = $row['prod_name'];
    $totalSold = $row['total_sold'];
    $price = $row['prod_price'];  // Get the price from the result

    // If product name does not exist in the array, create an empty array for it
    if (!isset($salesData[$productName])) {
        $salesData[$productName] = array();
    }

    // Store the total sold and price for the hour under the respective product
    $salesData[$productName][$hour] = [
        'total_sold' => $totalSold,
        'price' => $price
    ];
}


// Close the connection
$stmt->close();
$conn->close();

// Return the result as JSON
header('Content-Type: application/json');
echo json_encode($salesData);

?>
