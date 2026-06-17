<?php
// Enable CORS so your local React development server can access the PHP backend
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Database Credentials
// NOTE: Change these to match your hosting database settings
$host = "localhost";
$db_name = "shukanpack_db";
$username = "root";
$password = "";
$conn = null;

try {
    $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name . ";charset=utf8mb4", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $exception) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failure: " . $exception->getMessage()]);
    exit();
}

/**
 * Validates admin password from Request headers
 */
function check_admin_auth() {
    $auth = '';
    
    // Attempt to extract the Authorization header
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $auth = $_SERVER['HTTP_AUTHORIZATION'];
    } elseif (function_exists('getallheaders')) {
        $headers = getallheaders();
        if (isset($headers['Authorization'])) {
            $auth = $headers['Authorization'];
        }
    } elseif (function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        if (isset($headers['Authorization'])) {
            $auth = $headers['Authorization'];
        }
    }
    
    // Match the current admin password in React
    if ($auth !== 'Shukan@2026') {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Unauthorized access"]);
        exit();
    }
}
?>
