// verify-otp.php

<?php
session_start();

if (isset($_SESSION['email']) && isset($_SESSION['otp'])) {
    $email = $_SESSION['email'];
    $enteredOtp = $_SESSION['otp'];

    // Check if the entered OTP matches the one saved in session
    if (isset($_SESSION['otp']) && $_SESSION['otp'] == $enteredOtp) {
        echo "OTP verified"; // Success message
    } else {
        echo "Invalid OTP"; // Error message
    }
} else {
    echo "Missing OTP or email";
}
?>
