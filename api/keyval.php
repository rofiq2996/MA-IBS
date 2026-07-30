<?php
require_once "config.php";
header("Content-Type: application/json; charset=UTF-8");
$method = $_SERVER['REQUEST_METHOD'];

// Ensure table exists
try {
    $conn->exec("CREATE TABLE IF NOT EXISTS `key_value_store` (
        `k` varchar(255) NOT NULL,
        `v` longtext NOT NULL,
        PRIMARY KEY (`k`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
} catch(Exception $e) {}

if ($method == 'GET') {
    $key = isset($_GET['key']) ? $_GET['key'] : '';
    if ($key) {
        $stmt = $conn->prepare("SELECT v FROM `key_value_store` WHERE k = ?");
        $stmt->execute([$key]);
        $res = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode(["value" => $res ? $res['v'] : null]);
    } else {
        $stmt = $conn->prepare("SELECT * FROM `key_value_store`");
        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $obj = [];
        foreach($results as $row) {
            $obj[$row['k']] = $row['v'];
        }
        echo json_encode($obj);
    }
} elseif ($method == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data['key']) || !isset($data['value'])) {
        http_response_code(400);
        echo json_encode(["error" => "Missing key or value"]);
        exit;
    }
    $stmt = $conn->prepare("INSERT INTO `key_value_store` (k, v) VALUES (?, ?) ON DUPLICATE KEY UPDATE v = VALUES(v)");
    $stmt->execute([$data['key'], $data['value']]);
    echo json_encode(["status" => "success"]);
} elseif ($method == 'DELETE') {
    $key = isset($_GET['key']) ? $_GET['key'] : '';
    if ($key) {
        $stmt = $conn->prepare("DELETE FROM `key_value_store` WHERE k = ?");
        $stmt->execute([$key]);
        echo json_encode(["status" => "success"]);
    } else {
        $stmt = $conn->prepare("TRUNCATE TABLE `key_value_store`");
        $stmt->execute();
        echo json_encode(["status" => "success"]);
    }
}
