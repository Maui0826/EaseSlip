<?php
session_start();
require "/xampp/htdocs/EaseSlip/assets/connection.php";

$categories = [];
$username = '';  // Initialize the username variable

// Retrieve username from session
if (isset($_SESSION['username_id'])) {
    $username = $_SESSION['username_id'];  // Assuming 'username_id' contains the logged-in user's username
}

// Get categories
$sql = "SELECT DISTINCT categoryName FROM category";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $categories[] = $row['categoryName'];
    }
}

$response = [
    'username' => $username,
    'categories' => $categories
];

echo json_encode($response);

$conn->close();
?>
