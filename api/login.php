<?php
// api/login.php
header("Content-Type: application/json; charset=UTF-8");
include_once 'config.php';

// Mengambil data dari request body (React mengirim data dalam format JSON)
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->username) && !empty($data->password)) {
    // Di lingkungan produksi, gunakan password_verify(). 
    // Ini contoh sederhana menyesuaikan database.sql kita
    $query = "SELECT id, username, name, role, avatar FROM users WHERE username = :username AND password = :password LIMIT 1";
    
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':username', $data->username);
    $stmt->bindParam(':password', $data->password);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode([
            "status" => "success",
            "message" => "Login berhasil.",
            "user" => [
                "id" => $row['id'],
                "username" => $row['username'],
                "name" => $row['name'],
                "role" => $row['role'],
                "avatar" => $row['avatar']
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Username atau password salah."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Data tidak lengkap."]);
}
?>
