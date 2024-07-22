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

    // Check if email already exists
    $checkEmail = $conn->prepare('SELECT * FROM users WHERE email = ?');
    $checkEmail->bind_param('s', $email);
    $checkEmail->execute();
    $checkEmail->store_result();

    if ($checkEmail->num_rows > 0) {
        echo json_encode(["error" => "Email already exists"]);
        $checkEmail->close();
        $conn->close();
        exit;
    }
    $checkEmail->close();

    // Check if username already exists
    $checkUsername = $conn->prepare('SELECT * FROM users WHERE username = ?');
    $checkUsername->bind_param('s', $username);
    $checkUsername->execute();
    $checkUsername->store_result();

    if ($checkUsername->num_rows > 0) {
        echo json_encode(["error" => "Username already exists"]);
        $checkUsername->close();
        $conn->close();
        exit;
    }
    $checkUsername->close();

    // Insert new user
    $stmt = $conn->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
    $stmt->bind_param('sss', $username, $email, $hashedPassword);
    $stmt->execute();
    echo json_encode(["success" => "User registered successfully"]);

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["error" => "Invalid request method"]);
    exit;
}
