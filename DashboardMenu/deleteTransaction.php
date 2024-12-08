<?php
require "/xampp/htdocs/Ease_Slip/assets/connection.php"; // Adjust the path as needed

if (!isset($_POST['transactionID'])) {
    echo json_encode(['error' => 'Transaction ID is missing']);
    exit;
}

$transactionID = $_POST['transactionID'];

$query = "DELETE FROM transaction WHERE transactionID = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $transactionID);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Transaction deleted successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to delete transaction']);
}

$stmt->close();
$conn->close();
