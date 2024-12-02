<?php
$servername = "127.0.0.1";
$username = "root";
$password = "";
$database = "pos";

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get current week and last week dates
$thisWeekStart = date('Y-m-d', strtotime('monday this week'));
$thisWeekEnd = date('Y-m-d', strtotime('sunday this week'));
$lastWeekStart = date('Y-m-d', strtotime('monday last week'));
$lastWeekEnd = date('Y-m-d', strtotime('sunday last week'));

// Query for current week's data
$currentWeekQuery = "
    SELECT
        SUM(price * qty) AS revenue,
        SUM(price * qty * 0.3) AS profit,
        COUNT(*) AS time_sold
    FROM sale
    WHERE date >= ? AND date <= ?
";

$currentWeekStmt = $conn->prepare($currentWeekQuery);
$currentWeekStmt->bind_param('ss', $thisWeekStart, $thisWeekEnd);
$currentWeekStmt->execute();
$currentWeekResult = $currentWeekStmt->get_result()->fetch_assoc();

// Query for last week's data
$lastWeekStmt = $conn->prepare($currentWeekQuery); // Reuse the same query
$lastWeekStmt->bind_param('ss', $lastWeekStart, $lastWeekEnd);
$lastWeekStmt->execute();
$lastWeekResult = $lastWeekStmt->get_result()->fetch_assoc();

// Calculate growth
$lastWeekRevenue = $lastWeekResult['revenue'] ?: 1; // Avoid division by zero
$growth = (($currentWeekResult['revenue'] - $lastWeekRevenue) / $lastWeekRevenue) * 100;

// Format data for JSON response
$response = [
    'revenue' => "₱" . number_format($currentWeekResult['revenue'], 2),
    'profit' => "₱" . number_format($currentWeekResult['profit'], 2),
    'time_sold' => $currentWeekResult['time_sold'],
    'growth' => round($growth, 2) . '%',
];

// Send JSON response
header('Content-Type: application/json');
echo json_encode($response);

// Close connections
$currentWeekStmt->close();
$lastWeekStmt->close();
$conn->close();
?>
