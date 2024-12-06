<?php
session_start(); 
require "/xampp/htdocs/Ease_Slip/assets/connection.php";

// Query to fetch product and transaction data
$sql = "
    SELECT 
        p.productID,
        p.prod_name,
        SUM(t.sold) AS total_sold,
        (SUM(t.sold) * p.prod_price) AS total_price
    FROM product p
    LEFT JOIN transaction t ON p.productID = t.productID
    GROUP BY p.productID, p.prod_name, p.prod_price
";

$result = $conn->query($sql);

$data = [];

if ($result->num_rows > 0) {
    // Fetch data as associative array
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}
echo "$data";
// Return data as JSON
header('Content-Type: application/json');
echo json_encode($data);

// Close connection
$conn->close();
?>