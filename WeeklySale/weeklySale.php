<?php
// weeklySale.php
session_start();
require "/xampp/htdocs/Ease_Slip/assets/connection.php";  // Adjust this to your actual connection file

// Get the selected month and week from the query parameters
$selectedMonth = isset($_GET['month']) ? $_GET['month'] : date('m'); // Default to current month
$selectedWeek = isset($_GET['week']) ? $_GET['week'] : '1';          // Default to week 1

// Convert month name to a number if necessary
$monthNumber = date("m", strtotime($selectedMonth));

// Calculate the start and end dates for the selected week
$startDay = (($selectedWeek - 1) * 7) + 1; // First day of the week
$endDay = $startDay + 6;                   // Last day of the week

// Prepare the SQL query to fetch data within the week range
$query = "
    SELECT 
        p.prod_name,
        SUM(t.sold) AS total_sold,
        SUM(t.sold * p.prod_price) AS total_price
    FROM transaction t
    JOIN product p ON t.productID = p.productID
    WHERE MONTH(t.sold_date) = ? 
    AND DAY(t.sold_date) BETWEEN ? AND ?
    GROUP BY p.prod_name
";

$stmt = $conn->prepare($query);
$stmt->bind_param('iii', $monthNumber, $startDay, $endDay);
$stmt->execute();
$result = $stmt->get_result();

// Fetch the data and format it into an associative array
$salesData = array();
while ($row = $result->fetch_assoc()) {
    $productName = $row['prod_name'];
    $salesData[$productName] = [
        'total_sold' => $row['total_sold'],
        'total_price' => $row['total_price']
    ];
}

// Close the connection
$stmt->close();
$conn->close();

// Return the data as JSON
header('Content-Type: application/json');
echo json_encode($salesData);
?>
