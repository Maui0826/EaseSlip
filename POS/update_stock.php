<?php
session_start();
require "/xampp/htdocs/Ease_Slip/assets/connection.php";

$itemId = intval($_POST['productID']);
$quantity = intval($_POST['prod_quantity']);
$price = floatval($_POST['price']);  // Ensure price is float
$action = $_POST['action'];
$date = date('Y-m-d H:i:s');  // Current timestamp


// Check if action is 'decrease' or 'increase' and set the query accordingly
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

    // Add query to increase the product price
    if ($price > 0) {
        $priceQuery = "UPDATE product 
                        SET prod_price = $price 
                        WHERE productID = $itemId";
        $queries[] = $priceQuery;
    }

    // Insert into stock table (stock insert query)
    $stockInsertQuery = "INSERT INTO stock (productID, stock_quantity, date)
                        VALUES ($itemId, $quantity, '$date')";

    $queries[] = $productQuery;
    $queries[] = $stockInsertQuery;

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

    // Commit transaction if everything is fine
    $conn->commit();
    echo "Success";  

} catch (Exception $e) {
    // Rollback transaction if any query fails
    $conn->rollback();
    echo $e->getMessage();  
}

$conn->close();
?>

