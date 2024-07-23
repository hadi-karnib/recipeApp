<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
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
    $rating = $data['rating'];

    $stmt = $conn->prepare("INSERT INTO stars (id_recipe, id_user, star_value) VALUES (?, ?, ?)");
    $stmt->bind_param('iii', $recipe_id, $user_id, $rating);
    $stmt->execute();

    echo json_encode(["success" => true]);

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["error" => "Invalid request method"]);
}
