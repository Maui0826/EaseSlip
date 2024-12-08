<?php
session_start();
require "/xampp/htdocs/Ease_Slip/assets/connection.php";

// Check if the form is submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the category from the POST request
    $categoryName = isset($_POST['category']) ? $_POST['category'] : '';

    // Validate the category name (ensure it's not empty)
    if (!empty($categoryName)) {
        // Prepare and bind the SQL statement
        $stmt = $conn->prepare("INSERT INTO category (categoryName) VALUES (?)");
        $stmt->bind_param("s", $categoryName);  // "s" means the parameter is a string

        // Execute the query
        if ($stmt->execute()) {
            echo "Category added successfully!";
        } else {
            echo "Error: " . $stmt->error;
        }

        // Close the statement
        $stmt->close();
    } else {
        echo "Category name is required!";
    }
}

// Close the database connection
$conn->close();
?>

