<?php
session_start();
require "/xampp/htdocs/Ease_Slip/assets/connection.php";

$itemId = intval($_POST['productID']);
$quantity = intval($_POST['prod_quantity']);
$action = $_POST['action'];
$date = date('Y-m-d H:i:s');  // Current timestamp

if (!$itemId || !$quantity || !$action) {
    echo "Missing required data";
    exit();
}

// Check if the action is 'decrease' or 'increase' and set the query accordingly
if ($action === 'decrease') {
    // Decrease product and stock quantities only if the quantity is available
    $productQuery = "UPDATE product 
                     SET prod_quantity = prod_quantity - $quantity 
                     WHERE productID = $itemId AND prod_quantity >= $quantity";

    $stockQuery = "UPDATE stock 
                   SET stock_quantity = stock_quantity - $quantity 
                   WHERE productID = $itemId AND stock_quantity >= $quantity";

    // Execute queries for decreasing stock
    $queries = [$productQuery, $stockQuery];
} elseif ($action === 'increase') {
    // Increase product quantity
    $productQuery = "UPDATE product 
                     SET prod_quantity = prod_quantity + $quantity 
                     WHERE productID = $itemId";

    // Insert into stock table
    $stockInsertQuery = "INSERT INTO stock (productID, stock_quantity, date)
                        VALUES ($itemId, $quantity, '$date')";

    // Execute queries for increasing stock
    $queries = [$productQuery, $stockInsertQuery];
} else {
    echo "Invalid action";
    exit();
}

// Start transaction to ensure atomic operations
$conn->begin_transaction();

try {
    // Execute all queries in the array
    foreach ($queries as $query) {
        if ($conn->query($query) !== TRUE) {
            throw new Exception("Database error: " . $conn->error);
        }
    }

    // Commit the transaction
    $conn->commit();
    echo "success";  // Return success message
} catch (Exception $e) {
    // Rollback the transaction if any query fails
    $conn->rollback();
    echo $e->getMessage();  // Return the error message
}

$conn->close();
?>
