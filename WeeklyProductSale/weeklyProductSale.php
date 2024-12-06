<?php
session_start();
require "/xampp/htdocs/Ease_Slip/assets/connection.php";

error_reporting(E_ALL);
ini_set('display_errors', 1);

// Get the POST data in JSON format
$input = file_get_contents("php://input");
$data = json_decode($input, true);

$month = $data['month'] ?? date('F');   // Default to the current month
$week = $data['week'] ?? 1;             // Default to Week 1

// Determine the date range for filtering the selected month and week
$currentYear = date('Y');
$currentMonth = date('m');

// Define the start and end dates for the selected week
$startOfWeek = date("Y-m-d", strtotime("first day of $month $currentYear"));
$endOfWeek = date("Y-m-d", strtotime("last day of $month $currentYear"));

$sql = "
    SELECT 
        p.productID,
        p.prod_name,
        p.image_path,
        SUM(t.sold) AS total_sold,
        (SUM(t.sold) * p.prod_price) AS total_price
    FROM product p
    LEFT JOIN transaction t ON p.productID = t.productID
    WHERE DATE(t.sold_date) BETWEEN ? AND ?
    GROUP BY p.productID, p.prod_name, p.prod_price, p.image_path
";

$stmt = $conn->prepare($sql);
$stmt->bind_param('ss', $startOfWeek, $endOfWeek);
$stmt->execute();

$result = $stmt->get_result();

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

// Return the data as JSON
header('Content-Type: application/json');
echo json_encode($data);

$conn->close();
?>
