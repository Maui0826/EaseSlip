<?php
session_start();
require "/xampp/htdocs/EaseSlip/assets/connection.php";

// Updated SQL query with JOIN to get category name
$sql = "SELECT product.*, category.categoryName 
        FROM product 
        INNER JOIN category ON product.categoryID = category.categoryID";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $items = [];
    while ($row = $result->fetch_assoc()) {
        $items[] = $row;
    }
    echo json_encode($items);
} else {
    echo json_encode([]);
}

$conn->close();
?>

