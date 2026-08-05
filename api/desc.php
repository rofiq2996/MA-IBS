<?php
require_once "config.php";
$table = isset($_GET['table']) ? $_GET['table'] : 'grades';
$stmt = $conn->query("DESCRIBE `$table`");
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
?>
