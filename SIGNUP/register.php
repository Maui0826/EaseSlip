<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "registration";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if the form is submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Sanitize inputs
    $username = $conn->real_escape_string($_POST['username']);
    $email = $conn->real_escape_string($_POST['email']);
    $password = $_POST['password'];
    $conPassword = $_POST['conPassword'];

    // Check if passwords match
    if ($password !== $conPassword) {
        echo "Passwords do not match!";
        exit;
    }

    // Hash the password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Insert query
    $sql = "INSERT INTO registration (username, email, password) VALUES ('$username', '$email', '$hashedPassword')";

    // Execute the query and check for success
    if ($conn->query($sql) === TRUE) {
        header("Location: /LOGIN/login-1.html");
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

// Close connection
$conn->close();
?>
