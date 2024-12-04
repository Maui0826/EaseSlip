<?php
session_start();
require "/xampp/htdocs/Ease_Slip/assets/connection.php";


if (!isset($_POST['name']) || !isset($_POST['price']) || !isset($_POST['stock'])) {
    echo "Error: Missing required parameters (name, price, stock).";
    exit;
}

$name = $conn->real_escape_string($_POST['name']);
$price = floatval($_POST['price']);
$stock = intval($_POST['stock']);
$productID = $_POST['itemId'];  


if (!$name || !$price || !$stock || !$productID) {
    echo "Error: All fields (name, price, stock) are required.";
    exit;
}


$updateQuery = "UPDATE product SET prod_name = ?, prod_price = ?, prod_quantity = ? WHERE productID = ?";


$stmt = $conn->prepare($updateQuery);
if ($stmt) {
    
    $stmt->bind_param("sdii", $name, $price, $stock, $productID); 

    
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
