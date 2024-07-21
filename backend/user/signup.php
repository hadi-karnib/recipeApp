<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); // Replace this with the domain from which you are sending requests
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}
require '../connection.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $rawData = file_get_contents("php://input");

    $data = json_decode($rawData, true);

    $email = $data['email'];
    $password = $data['password'];
    $username = $data['username'];

    // Hash the password
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    // Check if email or username already exists
    $checkEmail = $conn->prepare('SELECT * FROM users WHERE email = ? OR username = ?');
    $checkEmail->bind_param('ss', $email, $username);
    $checkEmail->execute();
    $checkEmail->store_result();

    if ($checkEmail->num_rows > 0) {
        echo json_encode(["error" => "Email or Username already exists"]);
        exit;
    } else {
        $stmt = $conn->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
        $stmt->bind_param('sss', $username, $email, $hashedPassword);
        $stmt->execute();
        echo json_encode(["success" => "User registered successfully"]);
    }

    $checkEmail->close();
    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["error" => "Invalid request method"]);
    exit;
}
