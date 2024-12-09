<?php
session_start(); // Start the session to access session variables

// Database connection details
$servername = "localhost";
$username = "root";  // Your database username
$password = "";      // Your database password
$dbname = "easelip"; // Your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if the user is logged in and fetch the username
if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];
    
    // Fetch the username from the database
    $sql = "SELECT username FROM user WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $stmt->bind_result($username);
    $stmt->fetch();
    $stmt->close();
    
    // Output the username (it will be received as plain text)
    echo $username;
} else {
    echo ''; // Return empty string if no user is logged in
}

$conn->close();
?>
