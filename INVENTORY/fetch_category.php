<?php
session_start();
require "/xampp/htdocs/Ease_Slip/assets/connection.php";

// Updated SQL query to get category names
$sql = "SELECT categoryID, categoryName FROM category";

$result = $conn->query($sql);

if ($result) {
    if ($result->num_rows > 0) {
        $items = [];
        while ($row = $result->fetch_assoc()) {
            // Store category ID and category name
            $items[] = [
                'categoryID' => $row['categoryID'],
                'categoryName' => $row['categoryName']
            ];
        }
        echo json_encode($items);  // Output the data as JSON
    } else {
        echo json_encode([]);  // If no categories are found
    }
} else {
    // If the query fails
    echo json_encode(['error' => 'Error fetching categories: ' . $conn->error]);
}

$conn->close();
?>
