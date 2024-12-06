<?php
session_start();
require "/xampp/htdocs/Ease_Slip/assets/connection.php"; // Adjust the path as needed

// Get the selected date from the query parameter
$selectedDate = isset($_GET['date']) ? $_GET['date'] : date('Y-m-d');

// Prepare the SQL query to fetch sales data for the selected date
$query = "
    SELECT p.prod_name, 
           SUM(t.sold) AS total_sold, 
           p.prod_price,
           SUM(t.sold * p.prod_price) AS total_amount
    FROM transaction t
    JOIN product p ON t.productID = p.productID
    WHERE DATE(t.sold_date) = ?
    GROUP BY p.prod_name, p.prod_price
    ORDER BY p.prod_name
";

$stmt = $conn->prepare($query);
$stmt->bind_param('s', $selectedDate);
$stmt->execute();
$result = $stmt->get_result();

// Fetch results into an associative array
$salesData = [];
while ($row = $result->fetch_assoc()) {
    $productName = $row['prod_name'];
    $totalSold = intval($row['total_sold']);
    $price = floatval($row['prod_price']);
    $totalAmount = floatval($row['total_amount']); // Ensure the total amount is a float

    // Store the total amount sold for that product
    $salesData[$productName] = [
        'total_sold' => $totalSold,
        'total_amount' => $totalAmount,
    ];
}

// Close the connection
$stmt->close();
$conn->close();

// Return the data as JSON
header('Content-Type: application/json');
echo json_encode($salesData);
?>
