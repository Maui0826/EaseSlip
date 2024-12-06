<?php
session_start();
require "/xampp/htdocs/Ease_Slip/assets/connection.php";

// Check if the product ID is set
if (isset($_POST['id'])) {
    $id = $_POST['id'];

    // Step 1: Update transaction table to set productID to NULL for the given product
    $updateTransactionQuery = "UPDATE transaction SET productID = NULL WHERE productID = ?";
    $stmt = $conn->prepare($updateTransactionQuery);
    $stmt->bind_param("i", $id);

    if (!$stmt->execute()) {
        echo "Error updating transactions: " . $stmt->error;
        $stmt->close();
        $conn->close();
        exit;  // Exit if updating transaction fails
    }

    // Step 2: Delete the product from the product table
    $deleteProductQuery = "DELETE FROM product WHERE productID = ?";
    $stmt = $conn->prepare($deleteProductQuery);
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo "Item deleted successfully!";
    } else {
        echo "Error deleting item: " . $stmt->error;
    }

    // Clean up
    $stmt->close();
} else {
    echo "Error: Missing product ID.";
}

$conn->close();
?>
