<?php
require "/xampp/htdocs/Ease_Slip/assets/connection.php"; // Adjust the path as needed

if (!isset($_GET['date'])) {
    echo json_encode(['error' => 'Date parameter is missing']);
    exit;
}

$date = $_GET['date'];

$query = "SELECT t.transactionID, p.prod_name, p.prod_price, t.sold, t.sold_date
          FROM transaction t
          JOIN product p ON t.productID = p.productID
          WHERE DATE(t.sold_date) = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $date);
$stmt->execute();
$result = $stmt->get_result();

$transactions = [];
while ($row = $result->fetch_assoc()) {
    $transactions[] = $row;
}

$stmt->close();
$conn->close();

header('Content-Type: application/json');
echo json_encode($transactions);
