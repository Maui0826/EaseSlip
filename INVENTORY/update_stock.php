<?php
session_start();
require "/xampp/htdocs/EaseSlip/assets/connection.php";

// Check if the required POST parameters are received
if (!isset($_POST['productID']) || !isset($_POST['stock'])) {
    echo "Error: Missing required parameters (productID, stock).";
    exit;
}

$productID = $conn->real_escape_string($_POST['productID']);
$stock = $conn->real_escape_string($_POST['stock']);
$price = isset($_POST['price']) ? $conn->real_escape_string($_POST['price']) : null;

// Validate that productID and stock are provided
if (!$productID || !$stock) {
    echo "Error: Product ID and stock quantity are required.";
    exit;
}

// Prepare the SQL query to update stock
$updateQuery = "UPDATE product SET prod_quantity = ?";

// Add the price update if it's provided
if ($price !== null) {
    $updateQuery .= ", prod_price = ?";
}

// Complete the query with the WHERE clause
$updateQuery .= " WHERE productID = ?";  // Use productID instead of id

// Prepare the statement
$stmt = $conn->prepare($updateQuery);
if ($stmt) {
    // Bind parameters dynamically
    if ($price !== null) {
        $stmt->bind_param("dii", $stock, $price, $productID); // d for double (price), i for integer (stock, productID)
    } else {
        $stmt->bind_param("ii", $stock, $productID); // Only bind stock and productID if price is not provided
    }

    // Execute the query
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
