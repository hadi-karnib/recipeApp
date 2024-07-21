<?php
$dbName = "recipe";
$username = "root";
$password = "";
$serverName = "localhost";

$conn = new mysqli($serverName, $username, $password, $dbName);
if ($conn->connect_error) {
    die('connecton error' . $conn->connect_error);
}
