<?php
session_start();
require '/xampp/htdocs/EaseSlip/assets/connection.php';  // Adjust the path as necessary

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $newPassword = $_POST['newPassword'];
    $confirmPassword = $_POST['confirmPassword'];
    $email = $_POST['email'];  // You should pass the email when submitting

    if ($newPassword === $confirmPassword) {
        $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);  // Hash the password

        // Update the password in the database
        $sql = "UPDATE user SET password = ? WHERE email = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ss", $hashedPassword, $email);

        if ($stmt->execute()) {
            echo "Password reset successfully.";
        } else {
            echo "Error resetting password.";
        }
    } else {
        echo "Passwords do not match.";
    }
}
?>
