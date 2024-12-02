<?php
session_start();
require "/xampp/htdocs/Ease_Slip/assets/connection.php";

$itemId = $_POST['productID'];
$quantity = intval($_POST['prod_quantity']);
$action = $_POST['action'];

if ($action === 'decrease') {
    $sql = "UPDATE product SET prod_quantity = prod_quantity - $quantity WHERE productID = $itemId AND prod_quantity >= $quantity";
} elseif ($action === 'increase') {
    $sql = "UPDATE product SET prod_quantity = prod_quantity + $quantity WHERE productID = $itemId";
}

// Execute query and check for errors
if ($conn->query($sql) === TRUE) {
    echo "success";
} else {
    echo "Error: " . $conn->error;  // Output detailed error message if the query fails
}

?>
