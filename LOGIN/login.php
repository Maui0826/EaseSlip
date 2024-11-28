<?php
session_start(); // Start the session to manage user sessions

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
    $companyID = $_POST['CompanyID'];
    $password = $_POST['password'];

    // Validate inputs
    if (empty($companyID) || empty($password)) {
        echo "Please fill in both fields.";
        exit;
    }

    // Query to fetch user data
    $sql = "SELECT * FROM registration WHERE companyID = '$companyID'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        // User exists, fetch the data
        $user = $result->fetch_assoc();

        // Verify the password
        if (password_verify($password, $user['password'])) {
            // Password is correct, create a session
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['company_id'] = $user['companyID'];
            $_SESSION['email'] = $user['email'];

            // Redirect to dashboard
            header("Location: /DashboardMenu/dashboard.html");
            exit;
        } else {
            echo "Incorrect password. Please try again.";
        }
    } else {
        echo "No account found with the provided Company ID.";
    }
}

// Close connection
$conn->close();
?>