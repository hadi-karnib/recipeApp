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
    $stmt = $conn->prepare('
        SELECT recipes.recipe_name,recipes.recipe_id,users.username 
        FROM recipes 
        JOIN users ON recipes.user_id = users.id
    ');

    $stmt->execute();
    $result = $stmt->get_result();
    $recipes = [];

    while ($row = $result->fetch_assoc()) {
        $recipes[] = $row;
    }

    echo json_encode($recipes);

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["error" => "Invalid request method"]);
    exit;
}
