<?php
session_start();
require "/xampp/htdocs/EaseSlip/assets/connection.php";

// Check if 'category' is provided in the request
$category = isset($_GET['category']) ? $conn->real_escape_string($_GET['category']) : null;

// SQL query to fetch product details along with category name
if ($category) {
    $sql = "SELECT p.*, c.categoryName 
            FROM product p
            INNER JOIN category c ON p.categoryID = c.categoryID
            WHERE c.categoryName = ?";
} else {
    $sql = "SELECT p.*, c.categoryName 
            FROM product p
            INNER JOIN category c ON p.categoryID = c.categoryID";
}

$stmt = $conn->prepare($sql);
if ($stmt) {
    if ($category) {
        $stmt->bind_param("s", $category); // Bind category if it’s provided
    }
    $stmt->execute();
    $result = $stmt->get_result();
    
    $items = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $items[] = $row;
        }
    }
    echo json_encode($items); // Return items along with category name as JSON
    $stmt->close();
} else {
    echo json_encode(["error" => "Failed to prepare the SQL statement."]);
}

$conn->close();
?>
