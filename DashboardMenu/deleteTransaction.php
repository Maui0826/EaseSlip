<?php
require "/xampp/htdocs/Ease_Slip/assets/connection.php"; // Adjust the path as needed

if (!isset($_POST['transactionID'])) {
    echo json_encode(['error' => 'Transaction ID is missing']);
    exit;
}

$transactionID = $_POST['transactionID'];

// Start a transaction to ensure data consistency
$conn->begin_transaction();

try {
    // Fetch the product ID and sold quantity from the transaction
    $fetchQuery = "
        SELECT productID, sold 
        FROM transaction 
        WHERE transactionID = ?
    ";
    $fetchStmt = $conn->prepare($fetchQuery);
    $fetchStmt->bind_param("i", $transactionID);
    $fetchStmt->execute();
    $result = $fetchStmt->get_result();

    if ($result->num_rows === 0) {
        throw new Exception('Transaction not found');
    }

    $transaction = $result->fetch_assoc();
    $productID = $transaction['productID'];
    $soldQuantity = $transaction['sold'];

    $fetchStmt->close();

    // Update the prod_quantity in the product table
    $updateProductQuery = "
        UPDATE product 
        SET prod_quantity = prod_quantity + ? 
        WHERE productID = ?
    ";
    $updateProductStmt = $conn->prepare($updateProductQuery);
    $updateProductStmt->bind_param("ii", $soldQuantity, $productID);

    if (!$updateProductStmt->execute()) {
        throw new Exception('Failed to update product quantity');
    }

    $updateProductStmt->close();

    // Update the stock_quantity in the stock table
    $updateStockQuery = "
        UPDATE stock 
        SET stock_quantity = stock_quantity + ?
        WHERE productID = ?
    ";
    $updateStockStmt = $conn->prepare($updateStockQuery);
    $updateStockStmt->bind_param("ii", $soldQuantity, $productID);

    if (!$updateStockStmt->execute()) {
        throw new Exception('Failed to update stock quantity');
    }

    $updateStockStmt->close();

    // Delete the transaction
    $deleteQuery = "
        DELETE FROM transaction 
        WHERE transactionID = ?
    ";
    $deleteStmt = $conn->prepare($deleteQuery);
    $deleteStmt->bind_param("i", $transactionID);

    if (!$deleteStmt->execute()) {
        throw new Exception('Failed to delete transaction');
    }

    $deleteStmt->close();

    // Commit the transaction
    $conn->commit();

    echo json_encode(['success' => true, 'message' => 'Transaction deleted, product quantity, and stock restored successfully']);
} catch (Exception $e) {
    // Roll back the transaction on error
    $conn->rollback();
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

// Close the connection
$conn->close();
