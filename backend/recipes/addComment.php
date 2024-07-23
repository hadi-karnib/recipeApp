<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); // Replace with your frontend domain
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

    $recipe_id = $data['recipe_id'];
    $user_id = $data['user_id'];
    $content = $data['content'];

    $stmt = $conn->prepare("INSERT INTO comments (recipe_id, user_id, content) VALUES (?, ?, ?)");
    $stmt->bind_param('iis', $recipe_id, $user_id, $content);

    if ($stmt->execute()) {
        echo json_encode(["success" => "Comment added successfully"]);
    } else {
        echo json_encode(["error" => "Failed to add comment"]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["error" => "Invalid request method"]);
    exit;
}
