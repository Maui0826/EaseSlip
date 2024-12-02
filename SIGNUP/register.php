<?php
session_start();
require "/xampp/htdocs/Ease_Slip/assets/connection.php";


// Check if the form is submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Sanitize inputs
    $username = $conn->real_escape_string($_POST['username']);
    $email = $conn->real_escape_string($_POST['email']);
    $password = $_POST['password'];
    $conPassword = $_POST['conPassword'];

    // Check if passwords match
    if ($password !== $conPassword) {
        echo "<script>alert('Passwords do not match!');
        window.location.href = '/SIGNUP/signup.html';
        </script>";
        exit;
    }

    // Check if email or username already exists
    $checkQuery = "SELECT * FROM registration WHERE email = '$email' OR username = '$username'";
    $result = $conn->query($checkQuery);

    if ($result->num_rows > 0) {
        // Fetch the conflicting row
        $row = $result->fetch_assoc();
        if ($row['username'] === $username) {
            echo "<script> alert('This username is already taken.');
            window.location.href = '/SIGNUP/signup.html';
            </script>";
            exit;
        } 
    }

    // If no errors, proceed with registration
    if (empty($emailError) && empty($usernameError)) {
        // Hash the password
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        // Insert query to add the user to the database
        $sql = "INSERT INTO registration (username, email, password, status, code) 
                VALUES ('$username', '$email', '$hashedPassword', 'verified', 0)";

        if ($conn->query($sql) === TRUE) {
            header("Location: /LOGIN/login.html");
            exit;
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    }
}

// Close connection
$conn->close();
?>


