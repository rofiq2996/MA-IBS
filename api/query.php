<?php
// api/query.php
header("Content-Type: application/json; charset=UTF-8");
include_once 'config.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['query'])) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid JSON body or missing query"]);
    exit;
}

$query = $data['query'];
$params = isset($data['params']) ? $data['params'] : [];

try {
    $stmt = $conn->prepare($query);
    $stmt->execute($params);
    
    // Determine if it's a SELECT query or not
    if (stripos(trim($query), 'SELECT') === 0 || stripos(trim($query), 'SHOW') === 0) {
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);
    } else {
        echo json_encode(["status" => "success", "affected_rows" => $stmt->rowCount()]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
