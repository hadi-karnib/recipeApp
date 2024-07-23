<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); // Replace with your frontend domain
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
    // Get the raw POST data
    $rawData = file_get_contents("php://input");
    $data = json_decode($rawData, true);

    $recipe_id = $data['recipe_id'];
    $user_id = $data['user_id'];
    $content = $data['content'];

    // Prepare the SQL statement to insert the comment
    $stmt = $conn->prepare("INSERT INTO comments (recipe_id, user_id, content) VALUES (?, ?, ?)");
    $stmt->bind_param('iis', $recipe_id, $user_id, $content);

    if ($stmt->execute()) {
        // Comment added successfully
        echo json_encode(["success" => "Comment added successfully"]);
    } else {
        // Failed to add comment
        echo json_encode(["error" => "Failed to add comment"]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["error" => "Invalid request method"]);
    exit;
}
