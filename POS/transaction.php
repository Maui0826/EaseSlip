<?php
session_start();
require "/xampp/htdocs/Ease_Slip/assets/connection.php";

// Check if POST data exists
if (isset($_POST['productID']) && isset($_POST['prod_quantity'])) {
    $itemId = intval($_POST['productID']);  // Ensure the item ID is an integer
    $quantity = intval($_POST['prod_quantity']);  // Ensure the quantity is an integer
    $username = $_SESSION['username_id'];  // Assuming username_id is in the session

    // Get the user ID based on the username (you should have a user table where username is mapped to userID)
    $sql = "SELECT id FROM user WHERE username = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $username);  // Bind the username
    $stmt->execute();
    $result = $stmt->get_result();
    $userId = null;

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $userId = $row['id'];  // Get the userID
    }

    if ($userId !== null) {
        // Prepare the insert query for the transaction table
        $sql = "INSERT INTO transaction (productID, userID, sold, sold_date) 
                VALUES (?, ?, ?, NOW())";

        if ($stmt = $conn->prepare($sql)) {
            // Bind the parameters for productID, userID, and sold (quantity)
            $stmt->bind_param("iii", $itemId, $userId, $quantity);
            if ($stmt->execute()) {
                echo "Transaction updated successfully!";
            } else {
                echo "Error updating transaction: " . $stmt->error;
            }
            $stmt->close();  // Close statement here
        } else {
            echo "Error preparing statement: " . $conn->error;
        }
    } else {
        echo "User not found.";
    }

    // Do not call $stmt->close() again here as it's already closed inside the block
} else {
    echo "Missing productID or prod_quantity.";
}

$conn->close();
?>
