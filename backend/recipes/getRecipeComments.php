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

    $stmt = $conn->prepare("
        SELECT comments.content, users.username 
        FROM comments 
        JOIN users ON comments.user_id = users.id 
        WHERE comments.recipe_id = ?
    ");
    $stmt->bind_param('i', $recipe_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $comments = [];
    while ($row = $result->fetch_assoc()) {
        $comments[] = $row;
    }

    echo json_encode($comments);

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["error" => "Invalid request method"]);
    exit;
}
