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

if ($action === 'decrease') {
    $productQuery = "UPDATE product 
                     SET prod_quantity = prod_quantity - $quantity 
                     WHERE productID = $itemId AND prod_quantity >= $quantity";

    $stockQuery = "UPDATE stock 
                    SET stock_quantity = stock_quantity - $quantity 
                    WHERE productID = $itemId AND stock_quantity >= $quantity";

} elseif ($action === 'increase') {
    $productQuery = "UPDATE product 
                     SET prod_quantity = prod_quantity + $quantity 
                     WHERE productID = $itemId";

    $stockInsertQuery = "INSERT INTO stock (productID, stock_quantity, date)
                        VALUES ($itemId, $quantity, '$date')";
}

// Start transaction to ensure atomic operations
$conn->begin_transaction();

try {
    if ($conn->query($productQuery) === TRUE && $conn->query($stockInsertQuery) === TRUE) {
        $conn->commit();
        echo "success";
    } else {
        throw new Exception("Database error: " . $conn->error);
    }
} catch (Exception $e) {
    $conn->rollback();
    echo $e->getMessage();
}

$conn->close();
?>

