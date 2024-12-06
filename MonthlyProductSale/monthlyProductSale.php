<?php
session_start();
require "/xampp/htdocs/Ease_Slip/assets/connection.php";

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Get the POST data (month)
$input = file_get_contents("php://input");
$data = json_decode($input, true);

// Extract selected month
$month = isset($data['month']) ? $data['month'] : date('F'); 

// Query to fetch product and transaction data for the selected month
$sql = "
    SELECT 
        p.productID,
        p.prod_name,
        p.image_path,
        SUM(t.sold) AS total_sold,
        (SUM(t.sold) * p.prod_price) AS total_price
    FROM product p
    LEFT JOIN transaction t ON p.productID = t.productID
    WHERE MONTH(t.sold_date) = MONTH(CURDATE())
      AND YEAR(t.sold_date) = YEAR(CURDATE())
    GROUP BY p.productID, p.prod_name, p.prod_price, p.image_path
";

$stmt = $conn->prepare($sql);
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

