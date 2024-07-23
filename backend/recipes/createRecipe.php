<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); // Replace this with the domain from which you are sending requests
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}
require '../connection.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $rawData = file_get_contents("php://input");
    $data = json_decode($rawData, true);

    // Validate required fields
    if (isset($data['recipe_name'], $data['ingredients'], $data['steps'], $data['user_id'])) {
        $recipe_name = $data['recipe_name'];
        $ingredients = json_encode($data['ingredients']);
        $steps = json_encode($data['steps']);
        $user_id = $data['user_id'];

        $stmt = $conn->prepare("INSERT INTO recipes (recipe_name, ingredients, steps, user_id) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("sssi", $recipe_name, $ingredients, $steps, $user_id);

        if ($stmt->execute()) {
            echo json_encode(["success" => "Recipe created successfully"]);
        } else {
            echo json_encode(["error" => "Failed to create recipe"]);
        }

        $stmt->close();
    } else {
        echo json_encode(["error" => "Missing required fields"]);
    }

    $conn->close();
} else {
    echo json_encode(["error" => "Invalid request method"]);
    exit;
}
