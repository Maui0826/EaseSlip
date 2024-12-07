<?php
session_start();
require "/xampp/htdocs/Ease_Slip/assets/connection.php";

// Retrieve form data
$category = $conn->real_escape_string($_POST['category']);
$name = $conn->real_escape_string($_POST['name']);
$price = $conn->real_escape_string($_POST['price']);
$quantity = $conn->real_escape_string($_POST['quantity']);

// Image handling
if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $imageName = basename($_FILES['image']['name']);
    $imagePath = 'uploads/' . $imageName;

    // Create upload directory if not exists
    if (!file_exists('uploads/')) {
        mkdir('uploads', 0777, true);
    }

    // Move uploaded file
    if (move_uploaded_file($_FILES['image']['tmp_name'], $imagePath)) {
        // Check if category already exists
        $checkQuery = "SELECT categoryID FROM category WHERE categoryName = '$category'";
        $result = $conn->query($checkQuery);

        if ($result->num_rows > 0) {
            // Category exists, fetch categoryID
            $row = $result->fetch_assoc();
            $categoryID = $row['categoryID'];
        } else {
            // Insert new category
            $insertCategoryQuery = "INSERT INTO category (categoryName) VALUES ('$category')";
            if ($conn->query($insertCategoryQuery) === TRUE) {
                $categoryID = $conn->insert_id; // Get the newly inserted categoryID
            } else {
                echo "Error inserting category: " . $conn->error;
                exit;
            }
        }

        // Insert product with categoryID
        $insertProductQuery = "INSERT INTO product (categoryID, prod_name, prod_price, prod_quantity, image_path) 
                               VALUES ('$categoryID', '$name', '$price', '$quantity', '$imagePath')";
        if ($conn->query($insertProductQuery) === TRUE) {
            $productID = $conn->insert_id; // Get the newly inserted productID

            // Insert productID into stock table
            $insertStockQuery = "INSERT INTO stock (productID, stock_quantity) VALUES ('$productID', '$quantity')";
            if ($conn->query($insertStockQuery) === TRUE) {
                echo "Stock successfully added!";
            } else {
                echo "Error inserting into stock table: " . $conn->error;
            }
        } else {
            echo "Error inserting product: " . $conn->error;
        }
    } else {
        echo "Failed to upload image.";
    }
} else {
    echo "No image uploaded.";
}

$conn->close();
?>

