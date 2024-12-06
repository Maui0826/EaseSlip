<?php
session_start();
require "/xampp/htdocs/Ease_Slip/assets/connection.php";

// Check if the category ID is set
if (isset($_POST['id'])) {
    $id = $_POST['id'];

    // Step 1: Update product table to set categoryID to NULL for the products in the category
    $updateProductQuery = "UPDATE product SET categoryID = NULL WHERE categoryID = ?";
    $stmt = $conn->prepare($updateProductQuery);
    $stmt->bind_param("i", $id);

    if (!$stmt->execute()) {
        echo "Error updating products: " . $stmt->error;
        $stmt->close();
        $conn->close();
        exit;  // Exit if updating products fails
    }

    // Step 2: Delete the category from the category table
    $deleteCategoryQuery = "DELETE FROM category WHERE categoryID = ?";
    $stmt = $conn->prepare($deleteCategoryQuery);
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo "Category deleted successfully!";
    } else {
        echo "Error deleting category: " . $stmt->error;
    }

    // Clean up
    $stmt->close();
} else {
    echo "Error: Missing category ID.";
}

$conn->close();
?>
