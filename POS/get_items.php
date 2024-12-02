<?php
session_start();
require "/xampp/htdocs/Ease_Slip/assets/connection.php";

// Check if 'category' is provided in the request
$category = isset($_GET['category']) ? $conn->real_escape_string($_GET['category']) : null;

if ($category) {
    // Fetch products by category name using categoryID as foreign key
    $sql = "SELECT p.* 
            FROM product p
            INNER JOIN category c ON p.categoryID = c.categoryID
            WHERE c.categoryName = ?";
    
    $stmt = $conn->prepare($sql);
    if ($stmt) {
        $stmt->bind_param("s", $category); // Bind category name
        $stmt->execute();
        $result = $stmt->get_result();
        
        $items = [];
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $items[] = $row;
            }
        }
        echo json_encode($items); // Return products as JSON
        $stmt->close();
    } else {
        echo json_encode(["error" => "Failed to prepare the SQL statement."]);
    }
} else {
    // Fetch all products when no category is provided
    $sql = "SELECT * FROM product";
    $result = $conn->query($sql);
    
    $items = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $items[] = $row;
        }
    }
    echo json_encode($items); // Return all products
}

$conn->close();
?>
