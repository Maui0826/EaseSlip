<?php
session_start();
require "/xampp/htdocs/EaseSlip/assets/connection.php";

// Initialize response variable
$response = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Sanitize inputs
    $username = $conn->real_escape_string($_POST['username']);
    $email = $conn->real_escape_string($_POST['email']);
    $password = $_POST['password'];
    $conPassword = $_POST['conPassword'];

    // Check if passwords match
    if ($password !== $conPassword) {
        $response = "Passwords do not match!";
    }

    // Check if email or username already exists
    $checkQuery = "SELECT * FROM registration WHERE email = '$email' OR username = '$username'";
    $result = $conn->query($checkQuery);

    if ($result->num_rows > 0) {
        // Fetch the conflicting row
        $row = $result->fetch_assoc();
        if ($row['email'] === $email) {
            $response = "This email is already registered.";
        } elseif ($row['username'] === $username) {
            $response = "This username is already taken.";
        }
    }

    // If no errors, proceed with registration
    if (empty($response)) {
        // Hash the password
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $sql = "INSERT INTO registration (username, email, password, status, code) 
                VALUES ('$username', '$email', '$hashedPassword', 'verified', 0)";

        if ($conn->query($sql) === TRUE) {
            $response = 'success';  // Return success message to JavaScript
        } else {
            $response = "Error: " . $conn->error;
        }
    }
}

// Close connection
$conn->close();

// Return the response to JavaScript
echo $response;
?>

