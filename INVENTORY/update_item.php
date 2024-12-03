<?php
session_start();
require "/xampp/htdocs/EaseSlip/assets/connection.php";

// Check if the required POST parameters are received
if (!isset($_POST['name']) || !isset($_POST['price']) || !isset($_POST['stock'])) {
    echo "Error: Missing required parameters (name, price, stock).";
    exit;
}

$name = $conn->real_escape_string($_POST['name']);
$price = floatval($_POST['price']);
$stock = intval($_POST['stock']);
$productID = $_POST['itemId'];  // Assuming itemId is passed in the request

// Validate the inputs
if (!$name || !$price || !$stock || !$productID) {
    echo "Error: All fields (name, price, stock) are required.";
    exit;
}

// Prepare the SQL query to update the product details
$updateQuery = "UPDATE product SET prod_name = ?, prod_price = ?, prod_quantity = ? WHERE productID = ?";

// Prepare the statement
$stmt = $conn->prepare($updateQuery);
if ($stmt) {
    // Bind the parameters
    $stmt->bind_param("sdii", $name, $price, $stock, $productID); // s for string (name), d for double (price), i for integer (stock, productID)

    // Execute the query
    if ($stmt->execute()) {
        echo json_encode(['message' => 'Item successfully updated!']);
    } else {
        echo json_encode(['message' => 'Error updating item: ' . $conn->error]);
    }

    $stmt->close();
} else {
    echo json_encode(['message' => 'Failed to prepare the SQL statement.']);
}

$conn->close();
?>
