<?php
session_start();
require '/xampp/htdocs/Ease_Slip/assets/connection.php';  // Adjust the path as necessary

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $newPassword = $_POST['newPassword'] ?? null;
    $confirmPassword = $_POST['confirmPassword'] ?? null;
    $email = $_POST['email'] ?? null;  // Ensure this field is passed in the form

    if ($newPassword === $confirmPassword) {
        $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);  // Hash the password

        // Update the password in the database
        $sql = "UPDATE user SET password = ? WHERE email = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ss", $hashedPassword, $email);

        if ($stmt->execute()) {
            echo "<script>
                    alert('Password reset successfully.');
                    window.location.href = '/LOGIN/login.html';
                  </script>";
            exit;
        } else {
            echo "<script>
                    alert('Error resetting password.');
                    window.location.href = '/RESETPASSWORD/reset-password.html';
                  </script>";
            exit;
        }
    } else {
        echo "<script>
                alert('Passwords do not match.');
                window.location.href = '/RESETPASSWORD/reset-password.html';
              </script>";
        exit;
    }
}
?>
