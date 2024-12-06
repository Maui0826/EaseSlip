<?php
session_start();
require "/xampp/htdocs/Ease_Slip/assets/connection.php";

// Check required POST parameters
if (!isset($_POST['productID']) || !isset($_POST['prod_quantity']) || !isset($_POST['action'])) {
    echo "Error: Missing parameters.";
    exit;
}

$productID = intval($_POST['productID']);
$quantity = intval($_POST['prod_quantity']);
$action = $_POST['action'];

// Start a transaction for atomicity
$conn->begin_transaction();

try {
    // Determine the queries based on the action
    if ($action === 'decrease') {
        $productQuery = "UPDATE product SET prod_quantity = prod_quantity - ? WHERE productID = ? AND prod_quantity >= ?";
        $stockQuery = "UPDATE stock SET stock_quantity = stock_quantity - ? WHERE productID = ? AND stock_quantity >= ?";
    } elseif ($action === 'increase') {
        $productQuery = "UPDATE product SET prod_quantity = prod_quantity + ? WHERE productID = ?";
        $stockQuery = "UPDATE stock SET stock_quantity = stock_quantity + ? WHERE productID = ?";
    } else {
        echo "Error: Invalid action.";
        exit;
    }

    // Update product table
    $stmtProduct = $conn->prepare($productQuery);
    if (!$stmtProduct) {
        throw new Exception("Failed to prepare product query: " . $conn->error);
    }

    if ($action === 'decrease') {
        $stmtProduct->bind_param("iii", $quantity, $productID, $quantity);
    } else {
        $stmtProduct->bind_param("ii", $quantity, $productID);
    }

    if (!$stmtProduct->execute()) {
        throw new Exception("Error updating product: " . $stmtProduct->error);
    }
    $stmtProduct->close();

    // Update stock table
    $stmtStock = $conn->prepare($stockQuery);
    if (!$stmtStock) {
        throw new Exception("Failed to prepare stock query: " . $conn->error);
    }

    if ($action === 'decrease') {
        $stmtStock->bind_param("iii", $quantity, $productID, $quantity);
    } else {
        $stmtStock->bind_param("ii", $quantity, $productID);
    }

    if (!$stmtStock->execute()) {
        throw new Exception("Error updating stock: " . $stmtStock->error);
    }
    $stmtStock->close();

    // Commit the transaction
    $conn->commit();
    echo "success";
} catch (Exception $e) {
    // Rollback transaction on error
    $conn->rollback();
    echo $e->getMessage();
}

$conn->close();
?>

