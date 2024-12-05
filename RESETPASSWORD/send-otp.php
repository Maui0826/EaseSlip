// send-otp.php

<?php
session_start();

if (isset($_SESSION['email'])) {
    $email = $_SESSION['email'];

    // Generate a random OTP (6-digit number example)
    $otp = rand(100000, 999999);

    // Save OTP in session for later verification
    $_SESSION['otp'] = $otp;

    // Send OTP to email (simple mail function)
    $subject = "Your OTP Code";
    $message = "Your OTP is: $otp";
    $headers = "From: no-reply@example.com";

    if (mail($email, $subject, $message, $headers)) {
        echo "OTP sent"; // Success message
    } else {
        echo "Error sending OTP";
    }
} else {
    echo "No email provided";
}
?>
