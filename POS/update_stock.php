<?php
session_start();
require "/xampp/htdocs/Ease_Slip/assets/connection.php";

$itemId = $_POST['productID'];
$quantity = intval($_POST['prod_quantity']);
$action = $_POST['action'];

if ($action === 'decrease') {
    // Update the product quantity (ensure it doesn't go below 0)
    $productQuery = "UPDATE product 
                     SET prod_quantity = prod_quantity - $quantity 
                     WHERE productID = $itemId AND prod_quantity >= $quantity";

    // Update the stock quantity
    $stockQuery = "UPDATE stock 
                   SET stock_quantity = stock_quantity - $quantity 
                   WHERE productID = $itemId AND stock_quantity >= $quantity";
} elseif ($action === 'increase') {
    // Update the product quantity
    $productQuery = "UPDATE product 
                     SET prod_quantity = prod_quantity + $quantity 
                     WHERE productID = $itemId";

    // Update the stock quantity
    $stockQuery = "UPDATE stock 
                   SET stock_quantity = stock_quantity + $quantity 
                   WHERE productID = $itemId";
}

// Execute the queries and check for errors
$conn->begin_transaction(); // Start a transaction for atomicity

try {
    if ($conn->query($productQuery) === TRUE && $conn->query($stockQuery) === TRUE) {
        $conn->commit(); // Commit transaction if both queries succeed
        echo "success";
    } else {
        throw new Exception("Error updating quantities: " . $conn->error);
    }
} catch (Exception $e) {
    $conn->rollback(); // Rollback transaction on error
    echo $e->getMessage();
}

$conn->close();
?>

