<?php
session_start();
require "/xampp/htdocs/Ease_Slip/assets/connection.php";

if (isset($_POST['id'])) {
    $id = $_POST['id'];

    $sql = "DELETE FROM product WHERE productID = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo "Item deleted successfully!";
    } else {
        echo "Error deleting item: " . $stmt->error;
    }

    $stmt->close();
}

$conn->close();
?>
