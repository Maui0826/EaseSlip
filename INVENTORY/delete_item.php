<?php
session_start();
require "/xampp/htdocs/Ease_Slip/assets/connection.php";

if (isset($_POST['id'])) {
    $id = $_POST['id'];

    // Step 1: Remove the product reference in stock table
    $updateStockQuery = "DELETE FROM stock WHERE productID = ?";
    $stmt = $conn->prepare($updateStockQuery);
    $stmt->bind_param("i", $id);

    if (!$stmt->execute()) {
        echo "Error clearing stock references: " . $stmt->error;
        $stmt->close();
        $conn->close();
        exit;
    }

    // Step 2: Delete product from the product table
    $deleteProductQuery = "DELETE FROM product WHERE productID = ?";
    $stmt = $conn->prepare($deleteProductQuery);
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo "Product successfully deleted!";
    } else {
        echo "Error deleting product: " . $stmt->error;
    }

    $stmt->close();
} else {
    echo "Product ID is missing.";
}

$conn->close();
?>
