<?php
session_start();
require "/xampp/htdocs/EaseSlip/assets/connection.php";


if (!isset($_POST['productID']) || !isset($_POST['stock'])) {
    echo "Error: Missing required parameters (productID, stock).";
    exit;
}

$productID = $conn->real_escape_string($_POST['productID']);
$stock = $conn->real_escape_string($_POST['stock']);
$price = isset($_POST['price']) ? $conn->real_escape_string($_POST['price']) : null;


if (!$productID || !$stock) {
    echo "Error: Product ID and stock quantity are required.";
    exit;
}


$updateQuery = "UPDATE product SET prod_quantity = ?";


if ($price !== null) {
    $updateQuery .= ", prod_price = ?";
}


$updateQuery .= " WHERE productID = ?";  


$stmt = $conn->prepare($updateQuery);
if ($stmt) {
    
    if ($price !== null) {
        $stmt->bind_param("dii", $stock, $price, $productID); 
    } else {
        $stmt->bind_param("ii", $stock, $productID); 
    }

    
    if ($stmt->execute()) {
        echo "Stock successfully updated!";
    } else {
        echo "Error updating stock: " . $conn->error;
    }

    $stmt->close();
} else {
    echo "Failed to prepare the SQL statement.";
}

$conn->close();
?>
