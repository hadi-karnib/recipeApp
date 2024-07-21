<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); // Replace this with the domain from which you are sending requests
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Return early with headers only for preflight requests
    exit;
}
require '../connection.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $rawData = file_get_contents("php://input");


    $data = json_decode($rawData, true);

    $email = $data['email'];
    $password = $data['password'];

    $stmt = $conn->prepare('SELECT id, email, password FROM users WHERE email = ?');
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($id, $emailFromDB, $hashedPasswordFromDB);
        $stmt->fetch();

        if (password_verify($password, $hashedPasswordFromDB)) {
            echo json_encode(["success" => "User logged in successfully"]);
        } else {
            echo json_encode(["error" => "Invalid password"]);
        }
    } else {
        echo json_encode(["error" => "Email does not exist"]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["error" => "Invalid request method"]);
    exit;
}
