<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}
require '../connection.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['id'])) {
        $recipe_id = $data['id'];

        $stmt = $conn->prepare("
SELECT recipes.recipe_name, recipes.ingredients, recipes.steps, users.username
FROM recipes
JOIN users ON recipes.user_id = users.id
WHERE recipes.recipe_id = ?
");
        $stmt->bind_param("i", $recipe_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $recipe = $result->fetch_assoc();
            echo json_encode($recipe);
        } else {
            echo json_encode(["error" => "Recipe not found"]);
        }

        $stmt->close();
        $conn->close();
    } else {
        echo json_encode(["error" => "Missing recipe ID"]);
    }
} else {
    echo json_encode(["error" => "Invalid request method"]);
    exit;
}
