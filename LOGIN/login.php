<?php
session_start();
require "/xampp/htdocs/Ease_Slip/assets/connection.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];

    if (empty($username) || empty($password)) {
        echo "<script>alert('Please fill in both fields.'); window.location.href = '/LOGIN/login.html';</script>";
        exit;
    }

    $sql = "SELECT * FROM user WHERE username = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
    
        if (password_verify($password, $user['password'])) {
            session_start(); // Ensure sessions are started
    
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username_id'] = $user['username'];
            $_SESSION['email'] = $user['email'];
            $_SESSION['role'] = $user['username'] === 'admin' ? 'admin' : 'user';
    
            if ($_SESSION['role'] === 'admin') {
                header("Location: /DashboardMenu/dashboardM.html");
            } else {
                header("Location: /POS/billing.html");
            }
            exit();
        } else {
            echo "<script>alert('Incorrect password. Please try again.'); window.location.href = '/LOGIN/login.html';</script>";
        }
    } else {
        echo "<script>alert('No account found with the provided username.'); window.location.href = '/LOGIN/login.html';</script>";
        exit;
    }
    exit();
    

    $stmt->close();
}

$conn->close();
?>
