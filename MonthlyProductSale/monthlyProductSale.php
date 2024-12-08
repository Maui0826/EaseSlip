<?php
session_start();
require "/xampp/htdocs/Ease_Slip/assets/connection.php";

error_reporting(E_ALL);
ini_set('display_errors', 1);

// Get the JSON input
$input = file_get_contents("php://input");
$data = json_decode($input, true);

// Extract selected month and year from the request
$month = isset($data['month']) ? $data['month'] : date('F');
$year = isset($data['year']) ? $data['year'] : date('Y');

// Convert month name to numeric value (e.g., "January" -> 1)
$monthNumber = date('m', strtotime($month));

$sql = "
    SELECT 
        p.productID,
        p.prod_name,
        p.image_path,
        SUM(t.sold) AS total_sold,
        (SUM(t.sold) * p.prod_price) AS total_price
    FROM product p
    LEFT JOIN transaction t ON p.productID = t.productID
    WHERE MONTH(t.sold_date) = ? AND YEAR(t.sold_date) = ?
    GROUP BY p.productID, p.prod_name, p.prod_price, p.image_path
";

$stmt = $conn->prepare($sql);

// Bind the parameters to the query
$stmt->bind_param("ii", $monthNumber, $year);
$stmt->execute();

$result = $stmt->get_result();

$data = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

header('Content-Type: application/json');
echo json_encode($data);

$conn->close();
?>



